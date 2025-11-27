import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// DeepSeek API key - get yours at https://platform.deepseek.com/
const DEEPSEEK_API_KEY = "sk-bc6de tried to read your DeepSeek API key from .env but it wasn't provided. Please add DEEPSEEK_API_KEY to your .env file";

export async function POST(req: Request) {
  try {
    // Use OpenAI SDK with DeepSeek's API (they are compatible)
    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
    });

    const { message } = await req.json();

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
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
    console.error('DeepSeek API Error:', error);
    const errorMessage = error?.message || error?.error?.message || 'Unknown error';
    return NextResponse.json(
      { error: `Failed to process request: ${errorMessage}` },
      { status: 500 }
    );
  }
}
