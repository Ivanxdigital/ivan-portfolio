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

const tableName = 'faq_embeddings';

async function setupVectorStore() {
  console.log('Setting up vector store in Supabase...');

  try {
    // Create the pgvector extension if it doesn't exist
    const { error: extensionError } = await supabase.rpc('create_pg_vector_extension');
    
    if (extensionError && !extensionError.message.includes('already exists')) {
      console.error('Error creating pgvector extension:', extensionError);
      return;
    }
    
    console.log('Pgvector extension is set up.');

    // Check if table exists, if not create it
    const { error: tableCheckError } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);

    if (tableCheckError && tableCheckError.message.includes('does not exist')) {
      console.log(`Creating ${tableName} table...`);
      
      // Create the table
      const { error: createTableError } = await supabase.rpc('create_faq_embeddings_table');
      
      if (createTableError) {
        console.error('Error creating table:', createTableError);
        return;
      }
      
      console.log(`${tableName} table created successfully.`);
    } else {
      console.log(`${tableName} table already exists.`);
    }

    // Index the FAQ content
    await indexFaqContent();

    console.log('Vector store setup completed successfully!');
  } catch (error) {
    console.error('Error setting up vector store:', error);
  }
}

async function indexFaqContent() {
  // Load the FAQ markdown file
  const faqPath = path.join(process.cwd(), 'faq-data.md');
  const faqContent = fs.readFileSync(faqPath, 'utf-8');

  // Split the content into manageable chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 50
  });

  console.log('Splitting FAQ content into chunks...');
  
  // Process the FAQ content to extract Q&A pairs
  const faqSections = faqContent.split(/\n## /).filter(Boolean);
  const documents: Document[] = [];
  
  for (const section of faqSections) {
    const lines = section.split('\n');
    const sectionTitle = section.startsWith('# ') 
      ? lines[0].replace('# ', '') 
      : lines[0];
      
    // Extract Q&A pairs using regex
    const qaPattern = /\*\*Q: (.*?)\*\*\s+A: (.*?)(?=\n\*\*Q:|$)/g;
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

  console.log(`Extracted ${documents.length} Q&A pairs from FAQ.`);

  if (documents.length === 0) {
    console.error('No Q&A pairs found in the FAQ content!');
    return;
  }

  // Split the documents if they're too large
  const splitDocs = await textSplitter.splitDocuments(documents);
  console.log(`Split into ${splitDocs.length} chunks for embedding.`);

  // Store the documents in the vector store
  console.log('Generating embeddings and storing in Supabase...');
  await SupabaseVectorStore.fromDocuments(
    splitDocs,
    embeddings,
    {
      client: supabase,
      tableName,
      queryName: 'match_documents',
    }
  );

  console.log('FAQ content indexed successfully!');
}

// Create the vector store RPC functions
async function createRpcFunctions() {
  console.log('Creating RPC functions...');

  // Create pgvector extension function
  const createExtensionQuery = `
  CREATE OR REPLACE FUNCTION create_pg_vector_extension()
  RETURNS VOID AS $$
  BEGIN
    CREATE EXTENSION IF NOT EXISTS vector;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  const { error: extensionFuncError } = await supabase.rpc('create_pg_vector_extension');
  
  // If the function doesn't exist, create it
  if (extensionFuncError && extensionFuncError.message.includes('does not exist')) {
    const { error } = await supabase.rpc('create_rpc_function', {
      function_name: 'create_pg_vector_extension',
      function_sql: createExtensionQuery
    });
    
    if (error) {
      console.error('Error creating pgvector extension function:', error);
    }
  }

  // Create table function
  const createTableQuery = `
  CREATE OR REPLACE FUNCTION create_faq_embeddings_table()
  RETURNS VOID AS $$
  BEGIN
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id BIGSERIAL PRIMARY KEY,
      content TEXT,
      metadata JSONB,
      embedding VECTOR(1536)
    );
    CREATE INDEX IF NOT EXISTS embedding_idx ON ${tableName} USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  const { error: tableFuncError } = await supabase.rpc('create_faq_embeddings_table');
  
  // If the function doesn't exist, create it
  if (tableFuncError && tableFuncError.message.includes('does not exist')) {
    const { error } = await supabase.rpc('create_rpc_function', {
      function_name: 'create_faq_embeddings_table',
      function_sql: createTableQuery
    });
    
    if (error) {
      console.error('Error creating table function:', error);
    }
  }

  // Create function to create functions (meta!)
  const createFunctionFunction = `
  CREATE OR REPLACE FUNCTION create_rpc_function(function_name TEXT, function_sql TEXT)
  RETURNS VOID AS $$
  BEGIN
    EXECUTE function_sql;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  // This needs to be run directly as SQL, can't use RPC to create itself
  // For demonstration purposes only - in a real implementation, you'd need
  // to run this SQL directly or use another method to create it
  console.log('Note: The create_rpc_function would need to be created directly via SQL first');
}

// Main function
async function main() {
  try {
    // First create the RPC functions (this is a bit meta, as noted in the function)
    await createRpcFunctions();
    
    // Then set up the vector store
    await setupVectorStore();
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main(); 