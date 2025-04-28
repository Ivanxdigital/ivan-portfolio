# 📋 Style Recommender – Task Manager

| # | Task | Owner | Priority | Status | Notes |
|---|------|-------|----------|--------|-------|
| 1 | Remove `output: 'export'` line from `next.config.js` | AI Agent | High | ✅ | Enables API routes |
| 2 | Install dependencies (`openai`, `formidable`, `@types/formidable`) | AI Agent | High | ✅ | Note: `@vercel/ai` not available |
| 3 | Add `OPENAI_API_KEY` to `.env.local` and Vercel dashboard | Ivan | High | ✅ | Key added to .env.local |
| 4 | Create `app/api/generate-brief/route.ts` (Node runtime) | AI Agent | High | ✅ | Includes prompt, OpenAI call |
| 5 | Create `app/style-recommender/page.tsx` with form & UI | AI Agent | High | ✅ | Tailwind styling |
| 6 | Add link to Header (navigation) | AI Agent | Medium | ✅ | Added "Style Tool" link |
| 7 | Local testing (`npm run dev`) | Ivan | High | ✅ | Fixed API integration issues |
| 8 | Commit & push to GitHub | Ivan | High | ☐ | Triggers Vercel deploy |
| 9 | Live smoke‑test on Vercel | Ivan | High | ☐ | Check logs & output |
| 10 | Implement optional email send (SendGrid/Resend) | AI Agent | Low | ☐ | Nice‑to‑have |
| 11 | Monitoring & cost check (OpenAI & Vercel) | Ivan | Ongoing | ☐ | Set usage alerts |

Legend: ☐ = todo | ✅ = done
