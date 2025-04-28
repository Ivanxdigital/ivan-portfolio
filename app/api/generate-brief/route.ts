/*
POST multipart/form-data
Fields: businessInfo, colors, vibe, email? (optional), images (File | File[])
*/
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';          // force Node runtime
export const dynamic = 'force-dynamic';   // allow dynamic API

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// We're using formData() so we don't need to disable the body parser

export async function POST(req: NextRequest) {
  try {
    // Parse the form data from the request
    const formData = await req.formData();

    // Extract text fields
    const businessInfo = formData.get('businessInfo')?.toString() || '';
    const colors = formData.get('colors')?.toString() || '';
    const vibe = formData.get('vibe')?.toString() || '';
    const email = formData.get('email')?.toString() || '';

    let imagePrompt = '';
    const imageFile = formData.get('images') as File | null;

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const mimeType = imageFile.type;
      imagePrompt = `\nHere is an inspiration image (base64): data:${mimeType};base64,${base64}`;
    }

    const systemPrompt = `You are “Ivan AI,” a friendly web-consultant who explains websites in plain English.
Your reader is a Philippine business owner, often 40–60 years old, with little tech know-how.

Write a practical Website Style Brief (≈350–450 words) in 4 clear sections.
Use short sentences and bullet points — no jargon.

Look & Feel – one sentence on the overall vibe (“warm and modern,” “clean and professional,” etc.).

Colours – list 3–5 HEX colours and where to apply each (buttons, background, headings).

Fonts – one Google Font for headings, one for body; explain why they match and note they’re free.

Layout & Images – outline key blocks (hero, services, testimonials, contact) and mention mobile-friendly, fast-loading images.

If an inspiration image is provided: list 2–3 design elements to keep (colours, shapes, photo style) inside the relevant section.

Finish with a warm one-line invitation: “Let me know if you’d like me to build this for you.”

Tone: upbeat, simple, and helpful; avoid technical buzzwords.`;

    const userPrompt = `Business description: ${businessInfo}
Preferred colours: ${colors}
Desired vibe: ${vibe}${imagePrompt}`;

    // Create a streaming completion
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',          // Using gpt-4 as fallback if gpt-4o is not available
      temperature: 0.7,
      max_tokens: 800,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: true
    });

    // Create a text encoder for the stream
    const encoder = new TextEncoder();

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        let fullBrief = '';

        // Process each chunk from the OpenAI stream
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullBrief += content;
            controller.enqueue(encoder.encode(content));
          }
        }

        // Optional: email the full brief when streaming is complete
        if (email && fullBrief) {
          // TODO: sendEmail(email, fullBrief);
        }

        controller.close();
      }
    });

    // Return the stream with the appropriate headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to generate brief.' }, { status: 500 });
  }
}
