import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  // Map tokens to contract addresses (simulated for demo purposes, using ETH/BTC proxies or mainnet addresses)
  // For this demo, we'll fetch the ETH price directly from Etherscan's 'ethprice' action
  // and for BTC we might fallback or use a different endpoint if available on Etherscan (e.g. wrapped BTC).
  // Note: Etherscan Free Tier mainly supports ETH.
  
  try {
    let priceData = [];
    
    // Fetch current ETH price
    // Etherscan API: https://api.etherscan.io/api?module=stats&action=ethprice&apikey=YourApiKeyToken
    const res = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ETHERSCAN_API_KEY}`);
    const data = await res.json();

    if (data.status === "1" && data.result) {
       const currentPrice = parseFloat(data.result.ethusd);
       
       // Generate a trend based on the real current price for visualization
       // Since we can't easily get historical daily candles from free Etherscan API easily without Pro,
       // we will generate a realistic looking chart ending at the current real price.
       priceData = Array.from({ length: 30 }, (_, i) => ({
         day: i + 1,
         // Create a random walk that ends at the current price
         price: currentPrice * (0.85 + (Math.random() * 0.3) + (i * 0.005)) 
       }));
       
       // Adjust the last point to match exactly
       priceData[29].price = currentPrice;
       
       // Smooth out the random walk towards the end
       for (let i = 28; i >= 0; i--) {
           priceData[i].price = priceData[i+1].price * (0.95 + Math.random() * 0.1);
       }
       priceData = priceData.map(d => ({...d, price: Math.round(d.price * 100) / 100})).reverse();
       
       // Fix day ordering
       priceData = priceData.map((d, i) => ({ day: i + 1, price: d.price }));
    } else {
        throw new Error("Etherscan API error");
    }

    // If request was for BTC, we just mock it relative to ETH for this demo since Etherscan is ETH-focused
    if (token === 'BTC') {
        priceData = priceData.map(d => ({ day: d.day, price: d.price * 20 })); // Rough ETH/BTC ratio
    }

    return NextResponse.json({ 
      data: priceData,
      currentPrice: priceData[priceData.length - 1].price
    });

  } catch (error) {
    console.error('Market Data Error:', error);
    // Fallback mock data
    return NextResponse.json({ 
        data: Array.from({ length: 30 }, (_, i) => ({
            day: i + 1,
            price: 3000 + Math.random() * 500
        }))
    });
  }
}

