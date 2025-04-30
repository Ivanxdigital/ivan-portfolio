import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from 'fs';
import path from 'path';
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Fallback to .env
if (!process.env.SUPABASE_URL) {
  dotenv.config({ path: '.env' });
}

// Check for required environment variables
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please set these variables in your .env.local or .env file.');
  process.exit(1);
}

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize OpenAI embeddings
const embeddings = new OpenAIEmbeddings({
  modelName: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
});

async function ingestFAQ() {
  console.log('Starting FAQ data ingestion...');
  
  try {
    // Load the FAQ markdown file
    const faqPath = path.join(process.cwd(), 'faq-data.md');
    const faqContent = fs.readFileSync(faqPath, 'utf-8');
    
    console.log('Loaded FAQ content from faq-data.md');
    
    // Process the FAQ content to extract Q&A pairs
    const faqSections = faqContent.split(/\n## /).filter(Boolean);
    const documents: Document[] = [];
    
    for (const section of faqSections) {
      const lines = section.split('\n');
      const sectionTitle = section.startsWith('# ') 
        ? lines[0].replace('# ', '') 
        : lines[0];
        
      // Extract Q&A pairs using regex
      const qaPattern = /\*\*Q: (.*?)\*\*\s+A: (.*?)(?=\n\*\*Q:|$)/gs;
      let match;
      
      while ((match = qaPattern.exec(section)) !== null) {
        const question = match[1].trim();
        const answer = match[2].trim();
        
        // Create a document with the Q&A pair
        documents.push(
          new Document({
            pageContent: `Question: ${question}\nAnswer: ${answer}`,
            metadata: {
              section: sectionTitle,
              question,
              source: 'faq-data.md'
            }
          })
        );
      }
    }
    
    console.log(`Extracted ${documents.length} Q&A pairs from FAQ content.`);
    
    if (documents.length === 0) {
      console.error('No Q&A pairs found in the FAQ content!');
      return;
    }
    
    // Split the documents if they're too large
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 20
    });
    
    const splitDocs = await textSplitter.splitDocuments(documents);
    console.log(`Split into ${splitDocs.length} chunks for embedding.`);
    
    // Ensure the vectorize extension is created
    console.log('Ensuring pgvector extension is enabled...');
    await supabase.rpc('create_pg_vector_extension').catch(e => {
      // If the function doesn't exist or there's an error, try a direct SQL query
      if (e.message.includes('does not exist')) {
        console.log('Creating pgvector extension directly...');
        return supabase.sql('CREATE EXTENSION IF NOT EXISTS vector;');
      }
      // If the error is that the extension already exists, that's fine
      if (!e.message.includes('already exists')) {
        throw e;
      }
    });
    
    // Create the embeddings table if it doesn't exist
    console.log('Creating embeddings table if it doesn\'t exist...');
    await supabase.sql(`
      CREATE TABLE IF NOT EXISTS faq_embeddings (
        id BIGSERIAL PRIMARY KEY,
        content TEXT,
        metadata JSONB,
        embedding VECTOR(1536)
      );
      
      CREATE INDEX IF NOT EXISTS embedding_idx 
      ON faq_embeddings 
      USING ivfflat (embedding vector_cosine_ops) 
      WITH (lists = 100);
    `).catch(e => {
      console.error('Error creating table:', e);
      throw e;
    });
    
    // Create the match_documents function if it doesn't exist
    console.log('Creating match_documents function if it doesn\'t exist...');
    await supabase.sql(`
      CREATE OR REPLACE FUNCTION match_documents(
        query_embedding VECTOR(1536),
        match_count INT DEFAULT 5,
        filter JSONB DEFAULT '{}'
      ) 
      RETURNS TABLE (
        id BIGINT,
        content TEXT,
        metadata JSONB,
        similarity FLOAT
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT
          faq_embeddings.id,
          faq_embeddings.content,
          faq_embeddings.metadata,
          1 - (faq_embeddings.embedding <=> query_embedding) AS similarity
        FROM
          faq_embeddings
        WHERE
          CASE
            WHEN filter::TEXT = '{}'::TEXT THEN TRUE
            ELSE metadata @> filter
          END
        ORDER BY
          faq_embeddings.embedding <=> query_embedding
        LIMIT
          match_count;
      END;
      $$;
    `).catch(e => {
      console.error('Error creating match_documents function:', e);
      throw e;
    });
    
    // Store the documents in the vector store
    console.log('Generating embeddings and storing in Supabase...');
    await SupabaseVectorStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        client: supabase,
        tableName: 'faq_embeddings',
        queryName: 'match_documents',
      }
    );
    
    console.log('FAQ content ingestion completed successfully!');
    
    // Test a simple query to verify everything is working
    console.log('\nTesting with a sample query:');
    const testQuery = 'How much do your services cost?';
    console.log(`Query: "${testQuery}"`);
    
    const results = await new SupabaseVectorStore(embeddings, {
      client: supabase,
      tableName: 'faq_embeddings',
      queryName: 'match_documents',
    }).similaritySearch(testQuery, 1);
    
    console.log('Result:');
    console.log(results[0].pageContent);
    console.log('Metadata:', results[0].metadata);
    
  } catch (error) {
    console.error('Error ingesting FAQ data:', error);
    process.exit(1);
  }
}

// Run the ingestion
ingestFAQ(); 