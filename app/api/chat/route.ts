import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
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

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

