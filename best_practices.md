# RAG FAQ Bot Implementation - Best Practices

## Latest Best Practices Research

### Vector Store - Supabase pgvector
- We'll use Supabase with pgvector since the project already has dependencies related to Supabase
- Free tier limits: ~0.5 GB storage
- Performance considerations: Index creation is important for query performance

### OpenAI Embeddings
- Current model: `text-embedding-3-small` (most cost-effective option)
- Pricing: $0.02/1M tokens
- Batching best practice: Process in batches of 100 for optimal throughput

### Vercel AI SDK
- Current best practice is to use the Vercel AI SDK with Next.js for streaming responses
- Provides built-in hooks for chat UI implementation
- Handles token streaming efficiently

### LLM Selection
- Starting with `gpt-3.5-turbo` for cost efficiency
- Upgrade path to GPT-4o available via environment variable switch

## Environment Variables Needed
- `OPENAI_API_KEY` - For embeddings and LLM 
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Public Supabase key
- `SUPABASE_SERVICE_ROLE_KEY` - For admin operations like creating tables

## References
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [OpenAI Embeddings Documentation](https://platform.openai.com/docs/guides/embeddings)
- [Supabase Vector Documentation](https://supabase.com/docs/guides/ai/vector-columns) 