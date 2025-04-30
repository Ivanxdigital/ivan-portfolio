import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

// Load environment variables
dotenv.config({ path: '.env.local' });

/**
 * Loads FAQ data from the markdown file and splits it into chunks
 * @returns An array of text chunks suitable for embedding
 */
export async function loadFaqData() {
  try {
    // Read the FAQ markdown file
    const faqPath = path.join(process.cwd(), 'faq-data.md');
    const faqContent = fs.readFileSync(faqPath, 'utf-8');
    
    // Initialize the text splitter with appropriate chunk size and overlap
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,      // Size of each chunk in characters
      chunkOverlap: 100,   // Overlap between chunks to maintain context
      separators: ['\n\n', '\n', ' ', ''], // Try to split on these separators in order
    });
    
    // Split the content into chunks
    const chunks = await textSplitter.createDocuments([faqContent]);
    
    return chunks;
  } catch (error) {
    console.error('Error loading FAQ data:', error);
    throw error;
  }
}

// Test the function if this file is run directly
if (require.main === module) {
  (async () => {
    try {
      const faqChunks = await loadFaqData();
      console.log(`Successfully split FAQ into ${faqChunks.length} chunks:`);
      faqChunks.forEach((chunk, index) => {
        console.log(`\n--- Chunk ${index + 1} ---`);
        console.log(chunk.pageContent);
      });
    } catch (error) {
      console.error('Failed to load FAQ data:', error);
    }
  })();
} 