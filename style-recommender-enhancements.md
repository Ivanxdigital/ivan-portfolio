# ✨ TASK: Enhance "Website Style Recommender AI" (Phase 2)

This document tells the Cursor AI agent **exactly** how to upgrade the existing Style‑Recommender feature.  
Follow tasks **in order of priority** to maximise UX and perceived value.

---

## 📈 Priority Road‑map

| P # | Feature / Change | Done? |
|----|------------------|-------|
| 1 | **Stream the creative brief while it's generated** | ✅ |
| 2 | **Format the brief with headings, colour‑badges & lists** | ✅ |
| 3 | **Better form UX** – colour picker, vibe dropdown, image preview | ✅ |
| 4 | **"Copy" & "Download PDF" buttons under the result** | ☐ |
| 5 | **Generate optional hero mock‑image** via GPT-Image-1 | ✅ |
| 6 | **E‑mail copy to user & Ivan (checkbox)** | ☐ |
| 7 | **Rate‑limit (10 req/IP/h) + simple 24 h cache** | ☐ |

---

## 1 · Streaming Output   **(highest impact)**
1. **Install helper**  
   ```bash
   npm i @vercel/ai
   ```
2. **API route update** (`app/api/generate-brief/route.ts`)  
   ```ts
   import { OpenAIStream, StreamingTextResponse } from 'ai';
   // ...
   const completion = await openai.chat.completions.create({ ..., stream: true });
   const stream = OpenAIStream(completion);
   return new StreamingTextResponse(stream);
   ```
3. **Client side** – switch to `ai/react` hook  
   ```tsx
   import { useChat } from 'ai/react';
   const { messages, handleSubmit } = useChat({ api: '/api/generate-brief' });
   ```
   Render streamed `messages`.

---

## 2 · Rich Brief Formatting
1. Install renderer:  
   ```bash
   npm i react-markdown remark-gfm
   ```
2. Replace result block with markdown renderer:  
   ```tsx
   <ReactMarkdown className="prose prose-invert max-w-none" remarkPlugins={[gfm]}>
     {message.content}
   </ReactMarkdown>
   ```
3. Optionally wrap HEX codes in coloured badges via regex replacement before rendering.

---

## 3 · Improved Form UX
- **Colour Picker** (`react-colorful`) → updates hidden `colors` field.  
- **Vibe Dropdown** with 6–8 presets.  
- **Image Preview** using `URL.createObjectURL`.

---

## 4 · Copy & PDF
- Add "Copy" button (`navigator.clipboard.writeText(fullBrief)`).
- Add "Download PDF" → `html2canvas` + `jspdf`.  

---

## 5 · Hero Mock‑Image (toggle)
1. Checkbox: "Also generate a visual mock‑up".  
2. New API route `app/api/generate-image/route.ts` using GPT-Image-1.  
3. Render returned `url` under the brief inside a card.

---

## 6 · Email Copy
If `sendEmail` checkbox checked:  
`await resend.emails.send({ to: email, subject:'Your Website Brief', html: brief });`

---

## 7 · Rate‑Limit & Cache
Use Upstash Redis:  
```ts
const ratelimit = new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(10, '1 h') });
```
Cache by hash key for 24 h; if hit, return cached JSON.

---

### ✅ Finish
Test locally, commit, push, verify on Vercel, tick boxes in the table.
