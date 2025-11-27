"use client";

import React, { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MOCK_DATA = {
  ETH: Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    price: 3000 + Math.random() * 500 - 250 + (i * 20),
  })),
  BTC: Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    price: 60000 + Math.random() * 2000 - 1000 + (i * 100),
  })),
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function AiAnalytics() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your Multimodal DeFi Assistant. Ask me to analyze a token like ETH or BTC.' }
  ]);
  const [activeToken, setActiveToken] = useState<'ETH' | 'BTC'>('ETH');
  const [loading, setLoading] = useState(false);

  const [chartData, setChartData] = useState<any[]>(MOCK_DATA.ETH);
  
  // Fetch real market data when token changes
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/market-data?token=${activeToken}`);
        const result = await res.json();
        if (result.data) {
          setChartData(result.data);
        }
      } catch (e) {
        console.error("Failed to fetch market data", e);
      }
    };
    fetchData();
  }, [activeToken]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.token) {
        setActiveToken(data.token);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response || "I apologize, but I couldn't generate a response." }]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message || "Connection failed"}. Please check your API key.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 p-6 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur min-h-[500px]" id="analytics">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold">Multimodal Agent Chat</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 max-h-[400px]">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-gray-700' : 'bg-purple-600'}`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-lg text-sm max-w-[80%] ${m.role === 'user' ? 'bg-gray-800 text-white' : 'bg-purple-500/10 text-purple-100 border border-purple-500/20'}`}>
                {m.content.split('\n').map((line, idx) => <p key={idx} className="mb-1 last:mb-0">{line}</p>)}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="flex items-center gap-1 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI to analyze a token..."
            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-2 p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col border-l border-gray-800 pl-6 border-dashed">
        <h3 className="text-sm font-medium text-gray-400 mb-4 flex justify-between">
          <span>Live Market Data: {activeToken}</span>
          <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-900">Live</span>
        </h3>
        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#666" tick={{fontSize: 12}} />
              <YAxis domain={['auto', 'auto']} stroke="#666" tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={activeToken === 'ETH' ? '#8b5cf6' : '#f59e0b'} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {[
            { label: 'Sentiment', val: 'Bullish', color: 'text-green-400' },
            { label: 'Vol (24h)', val: '$1.2B', color: 'text-white' },
            { label: 'AI Confidence', val: '87%', color: 'text-blue-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-800/50 p-3 rounded-lg text-center">
              <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
              <div className={`font-semibold ${stat.color}`}>{stat.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

