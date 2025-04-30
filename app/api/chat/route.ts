import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatOpenAI } from '@langchain/openai';
import { Message } from 'ai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { createStreamDataTransformer, StreamingTextResponse } from 'ai';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize OpenAI embeddings
const embeddings = new OpenAIEmbeddings({
  modelName: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
});

// Initialize vector store
const vectorStore = new SupabaseVectorStore(embeddings, {
  client: supabase,
  tableName: 'faq_embeddings',
  queryName: 'match_documents',
});

// Custom LangChain stream adapter for Vercel AI SDK
function langChainStreamAdapter(
  stream: ReadableStream,
  { onCompletion }: { onCompletion?: (completion: string) => Promise<void> } = {}
): ReadableStream {
  let completion = '';
  const transformStream = new TransformStream({
    async transform(chunk, controller) {
      const text = new TextDecoder().decode(chunk);
      completion += text;
      controller.enqueue(chunk);
    },
    async flush(controller) {
      if (onCompletion) {
        await onCompletion(completion)
          .catch((e) => {
            console.error('Error in onCompletion callback:', e);
          });
      }
      controller.terminate();
    },
  });
  
  return stream
    .pipeThrough(transformStream)
    .pipeThrough(createStreamDataTransformer());
}

export async function POST(req: NextRequest) {
  try {
    // Get the JSON body from the request
    const { messages } = await req.json();
    
    // Get the most recent user message
    const lastUserMessage = messages
      .filter((message: Message) => message.role === 'user')
      .pop();
    
    if (!lastUserMessage || !lastUserMessage.content) {
      return new Response('No user message found', { status: 400 });
    }
    
    const query = lastUserMessage.content.trim();
    
    // Retrieve relevant documents from the vector store
    const searchResults = await vectorStore.similaritySearch(query, 3);
    
    // Format retrieved context for the LLM
    const context = searchResults.map((doc) => {
      const { pageContent, metadata } = doc;
      return `${pageContent}\nSource: ${metadata.source || 'FAQ'}, Section: ${metadata.section || 'General'}`;
    }).join('\n\n');
    
    // Create chat model
    const model = new ChatOpenAI({
      modelName: process.env.LLM_MODEL || 'gpt-3.5-turbo',
      temperature: 0.7,
      streaming: true,
    });
    
    // Create prompt template
    const template = `You are a helpful assistant for a web development and design business. 
You answer questions based on the FAQ information provided.
If the answer is not in the provided context, kindly say that you don't have that information yet, but the user can contact directly at ivanxdigital@gmail.com.

Context:
{context}

Question: {question}

Answer the question using only the provided context. Be conversational but concise.
Include any relevant contact details that might be in the context if appropriate.
`;
    
    const promptTemplate = PromptTemplate.fromTemplate(template);
    
    // Create runnable sequence
    const chain = RunnableSequence.from([
      {
        context: () => context,
        question: () => query,
      },
      promptTemplate,
      model,
      new StringOutputParser(),
    ]);
    
    // Stream the response
    const stream = await chain.stream();
    
    // Convert the LangChain stream to a format compatible with Vercel AI SDK
    const adaptedStream = langChainStreamAdapter(stream as unknown as ReadableStream, {
      onCompletion: async (completion) => {
        console.log('Chat completion:', completion.slice(0, 100) + '...');
      },
    });
    
    // Return the streaming response
    return new StreamingTextResponse(adaptedStream);
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
} 