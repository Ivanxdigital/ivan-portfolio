import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    const { businessInfo, colors, vibe, brief } = await req.json();

    // Create a prompt for image generation based on the brief and business info
    const prompt = `
      Create a modern, professional website hero image mockup for a business with the following details:

      Business: ${businessInfo}
      Color scheme: ${colors}
      Style/Vibe: ${vibe}

      Brief summary: ${brief.substring(0, 300)}...

      The mockup should be a clean, professional website header/hero section design that incorporates
      the brand colors and matches the described style. Include placeholder for logo, navigation,
      and a compelling hero section with appropriate imagery and text layout. Make it look like a
      realistic website mockup viewed in a browser.
    `;

    console.log('Generating image with prompt:', prompt.trim());

    let response;

    // Use DALL-E 3 directly since gpt-image-1 is having issues
    console.log('Generating image with DALL-E 3 model');
    response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt.trim(),
      quality: "standard",
      size: "1024x1024",
      style: "natural"
    });

    // Check if we have a valid response with data
    if (!response.data || response.data.length === 0) {
      throw new Error('No image was generated');
    }

    console.log('Image generated successfully');
    console.log('Full response:', JSON.stringify(response, null, 2));

    // Log the image URL for debugging
    const imageUrl = response.data[0]?.url;
    console.log('Generated image URL:', imageUrl);

    // Check if we have a valid URL
    if (!imageUrl) {
      console.error('Image URL is undefined or empty');
      throw new Error('Image URL is undefined or empty');
    }

    // Try to validate the URL
    try {
      new URL(imageUrl);
      console.log('URL is valid');
    } catch (e) {
      console.error('Invalid URL format:', imageUrl);
      throw new Error('Invalid URL format returned from image generation API');
    }

    // Return the image URL and additional info
    return NextResponse.json({
      imageUrl,
      prompt: prompt.trim(),
      // Include additional metadata but handle TypeScript type issues
      modelUsed: (response as any).model || 'unknown',
      created: Date.now()
    });

  } catch (error: any) {
    console.error('Error generating image:', error);

    // Provide more detailed error information
    const errorMessage = error.message || 'Unknown error';
    const statusCode = error.status || 500;

    return NextResponse.json(
      {
        error: 'Failed to generate image mockup',
        details: errorMessage,
        status: statusCode
      },
      { status: statusCode }
    );
  }
}
