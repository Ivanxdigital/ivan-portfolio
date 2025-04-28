
# 🛠️ TASK: Add “Website Style Recommender AI” feature  
*(Next 13.5 – App Router – Vercel)*  

## 0. High‑Level Goal
Create an interactive tool at **`/style-recommender`** that lets visitors  

1. enter business info, preferred colours, desired vibe  
2. optionally upload 1–3 inspiration images (≤ 4 MB total)  
3. receive a GPT‑4‑generated creative brief in seconds  
4. optionally e‑mail the brief to Ivan  

### Constraints
* Keep existing styling (Tailwind + dark theme).  
* Use **OpenAI GPT‑4** (vision‑capable if available) from a **Node‑runtime route handler**.  
* Minimal new deps; no breaking changes to current pages.  
* Works locally (`npm run dev`) **and** on Vercel (serverless).  

---

## 1. Analyse current repo
* Confirm we’re on **Next 13.5.1 App Router** (`app/` structure).  
* Note `next.config.js` has `output: 'export'` → **API routes are disabled**.  
  We must remove that line to enable serverless functions.

---

## 2. Install / update dependencies
```bash
npm i openai formidable @vercel/ai         # core AI + form-parser + streaming helpers
npm i -D @types/formidable                 # TS types
```
*(If you later choose Vercel Blob, also `npm i @vercel/blob`.)*

---

## 3. Amend **next.config.js**
```diff
- output: 'export',
+ // output: 'export',   // ❌ remove to enable API routes
```
(Keep the rest of the config unchanged.)

---

## 4. Environment variables
Create **.env.local** (and add in Vercel dashboard):
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 5. New route handler → `app/api/generate-brief/route.ts`
```ts
/* 
POST multipart/form-data
Fields: businessInfo, colors, vibe, email? (optional), images (File | File[])
*/
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import { readFile } from 'fs/promises';
import { Configuration, OpenAIApi } from 'openai';

export const runtime = 'nodejs';          // force Node runtime
export const dynamic = 'force-dynamic';   // allow dynamic API

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

// disable Next body parser for file uploads
export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  try {
    const form = new formidable.IncomingForm({ maxFileSize: 4 * 1024 * 1024 });
    const { fields, files } = await new Promise<any>((resolve, reject) =>
      form.parse(req as any, (err, flds, fls) => (err ? reject(err) : resolve({ fields: flds, files: fls })))
    );

    const { businessInfo = '', colors = '', vibe = '', email = '' } = fields;

    let imagePrompt = '';
    const img = Array.isArray(files.images) ? files.images[0] : files.images;
    if (img) {
      const data = await readFile(img.filepath);
      const base64 = data.toString('base64');
      imagePrompt = `\nHere is an inspiration image (base64): data:${img.mimetype};base64,${base64}`;
    }

    const systemPrompt = \`You are an expert brand & web-design consultant.
Generate a detailed, professional website creative brief (~400–600 words) with sections:
Theme/Vibe, Colour Palette, Typography, Layout & Imagery, and Next Steps.
Tailor it to the given business info and preferences. If an inspiration image is provided,
analyse its style and weave insights into the brief.\`;

    const userPrompt = \`Business description: \${businessInfo}
Preferred colours: \${colors}
Desired vibe: \${vibe}\${imagePrompt}\`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',          // fall back to gpt-4 if not available
      temperature: 0.7,
      max_tokens: 800,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });

    const brief = completion.data.choices[0].message?.content ?? '—';

    /* Optional: email brief to Ivan (implement later) */
    if (email) {
      // TODO: sendEmail(email, brief);
    }

    return NextResponse.json({ brief });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to generate brief.' }, { status: 500 });
  }
}
```

---

## 6. New page → `app/style-recommender/page.tsx`
```tsx
'use client';

import { useState } from 'react';

export default function StyleRecommender() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult('');
    const data = new FormData(e.currentTarget);
    const res = await fetch('/api/generate-brief', { method: 'POST', body: data });
    const json = await res.json();
    setResult(json.brief || json.error);
    setLoading(false);
  }

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 gradient-text">Website Style Recommender</h1>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <textarea name="businessInfo" placeholder="Tell me about your business…" required className="w-full p-3 rounded bg-secondary/40" />
        <input name="colors" placeholder="Preferred colours (hex or names)" className="w-full p-3 rounded bg-secondary/40" />
        <input name="vibe" placeholder="Desired vibe (e.g. modern, playful)" className="w-full p-3 rounded bg-secondary/40" />
        <div>
          <label className="block mb-1">Upload inspiration images (max 3, ≤ 4 MB total)</label>
          <input type="file" name="images" accept="image/*" multiple className="w-full" />
        </div>
        <button type="submit" disabled={loading} className="gradient-bg text-white px-6 py-2 rounded shadow">
          {loading ? 'Generating…' : 'Generate Brief'}
        </button>
      </form>

      {result && (
        <article className="mt-8 p-6 bg-secondary/40 rounded whitespace-pre-wrap leading-relaxed">{result}</article>
      )}
    </section>
  );
}
```

---

## 7. Wire into navigation
Add a link to `/style-recommender` in `components/header.tsx`.

---

## 8. Dev → Build → Deploy
```bash
npm run dev                 # local test
git add .
git commit -m "feat: website style recommender AI"
git push                    # Vercel auto‑build & deploy
```

---

## 9. Post‑deploy checklist
* Test with & without images.  
* Check Vercel logs.  
* Monitor OpenAI usage.  
* Finish optional email feature.  

---

**Done.**
