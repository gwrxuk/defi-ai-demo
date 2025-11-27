import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Lazy initialize to avoid build-time errors if env var is missing
    const openai = new OpenAI({
      apiKey: "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",
    });

    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a specialized DeFi trading assistant. You analyze crypto markets, providing technical analysis (VWAP, RSI, Trends) and sentiment analysis. You can analyze any token but focus on ETH and BTC. Keep responses concise and professional."
        },
        { role: "user", content: message }
      ],
    });

    const responseContent = completion.choices[0].message.content;
    
    // Simple keyword extraction for the frontend to switch charts
    let detectedToken = null;
    if (message.toLowerCase().includes('eth') || responseContent?.toLowerCase().includes('ethereum')) {
      detectedToken = 'ETH';
    } else if (message.toLowerCase().includes('btc') || responseContent?.toLowerCase().includes('bitcoin')) {
      detectedToken = 'BTC';
    }

    return NextResponse.json({ 
      response: responseContent,
      token: detectedToken
    });

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    const errorMessage = error?.message || error?.error?.message || 'Unknown error';
    return NextResponse.json(
      { error: `Failed to process request: ${errorMessage}` },
      { status: 500 }
    );
  }
}
