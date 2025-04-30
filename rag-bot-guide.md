<!-- rag-bot-guide.md -->
# RAG FAQ Bot – Integration Guide for the AI Coding Agent  
*Target model : Claude 3.7 Sonnet (≈ 200 k context)*  

> **Purpose**: Add a Retrieval‑Augmented‑Generation (RAG) FAQ chatbot to the portfolio website. The bot answers visitor questions by retrieving the most relevant FAQ snippets from a vector database, then prompting OpenAI models to draft concise answers.

---

## 0. Operating Rules (read before coding)
1. **Gather full context first** – inspect repository, env vars, existing CI/CD, design system, hosting platform. *Pause coding until gaps are filled.*  
2. **Keep the Task Manager (section § 2) up to date** – tick ✅ when complete, break large steps into new subtasks, append blockers.  
3. **Minimise token usage** – use retrieval instead of pasting whole files, summarise long logs, chunk docs at source.  
4. **When an external API or SDK is needed:**  
   a. **Search the web for "latest best practices"** (docs, changelogs, blog posts).  
   b. Note findings in `best_practices.md`.  
   c. Only then implement, citing versions and links in comments.  
5. **Write idempotent, small PRs** (<150 LoC where possible) to aid review.

---

## 1. Recommended Architecture
| Layer | Budget‑friendly choice | Notes |
|-------|-----------------------|-------|
| **Frontend & Hosting** | **Next.js 14 + Vercel** (free tier) | Built‑in Edge Functions & AI SDK for token‑streaming UI |
| **Vector Store** | **Supabase Postgres (pgvector)** *or* **Pinecone** | Free tiers ~0.5 GB / 1 M reads‑mo ⇒ fine for portfolio scale |
| **Embeddings** | `text-embedding-3-small` (OpenAI) | Cheapest adequate quality |
| **LLM** | `gpt-3.5-turbo` for prod, upgrade path to GPT‑4o | Swap via env var |
| **Orchestration** | **LangChain TS** *or* **Vercel AI SDK** | Both have RAG templates; choose one and stay consistent |

Sequence:

```
User ► /api/chat ► RAG router
          ├─ search vector DB (top‑k 3)
          └─ prompt LLM with {question + snippets}
LLM ► stream answer to client
```

---

## 2. 📋 Task Manager
> **Maintain this list!** Tick items and add new subtasks as you progress.

- [x] **T‑0 Context Collection**  
  - [x] Clone repo & scan architecture (`tree -L 2`)  
  - [x] List env vars & secrets needed (OpenAI_KEY, DB_URL, etc.)  
  - [x] Confirm chosen vector store & credentials  
  - [x] Collect FAQ source docs (Markdown, CMS, etc.)

- [x] **T‑1 Best‑Practice Research**  
  - [x] Vercel AI SDK RAG example (search)  
  - [x] Supabase pgvector setup & cost limits  
  - [x] Pinecone free‑tier limits & TS client usage  
  - [x] OpenAI embeddings pricing & batching tips

- [x] **T‑2 Environment Setup**  
  - [x] Add deps: `npm i langchain ai @supabase/supabase-js @langchain/openai @langchain/community @langchain/core`  
  - [x] Create `env.example` with placeholder keys (cannot create .env.local directly)  
  - [x] Write `scripts/setup-vector.ts` to init pgvector or Pinecone index

- [x] **T‑3 Data Ingestion Pipeline**  
  - [x] Chunk FAQs (≈ 300 tokens each, 20 overlap)  
  - [x] Generate embeddings & upsert into vector store  
  - [x] Log counts & embedding costs

- [x] **T‑4 RAG API Route** (`/app/api/chat/route.ts`)  
  - [x] Accept `{conversation, question}`  
  - [x] Retrieve top‑k (3) docs, compose prompt template  
  - [x] Stream response via Vercel AI SDK

- [x] **T‑5 Chat UI** (`components/Chat.tsx`)  
  - [x] Use `useChat` hook (AI SDK) for streaming UX  
  - [x] Add source‑citation reveal on hover

- [ ] **T‑6 Tests & Metrics**  
  - [ ] Unit test embed + search with sample queries  
  - [ ] Add simple logging of tokens & latency

- [ ] **T‑7 Deploy & Verify**  
  - [ ] Push to Vercel preview → production  
  - [ ] Smoke‑test & monitor usage dashboard

---

## 3. Coding Conventions
- TypeScript strict mode, Prettier, ESLint.  
- `.env.example` committed; real keys in Vercel dashboard.  
- Comments reference external docs with permalink.  
- Handle errors gracefully (fallback "I don't have that info yet").  

---

## 4. Future Enhancements (backlog – do **NOT** start yet)
1. Support multiple namespaces for multi‑tenant SaaS.  
2. Add auto‑re‑embedding webhook on CMS update.  
3. Analytics page (token spend, questions, satisfaction vote).  

---

### End of Guide  
*Update the Task Manager and proceed once **T‑0** is fully complete.*
