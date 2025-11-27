"use client";

import React, { useState } from 'react';
import { ArrowRight, Wallet, TrendingDown } from 'lucide-react';

export function SmartOrderRouter() {
  const [amount, setAmount] = useState<string>('100');
  
  // Simulated DEX routing logic
  const calculateRoutes = (val: number) => {
    if (val <= 0) return [];
    // Just a mock distribution that changes based on amount
    const uniswap = Math.min(val * 0.6, val * (0.5 + Math.random() * 0.1));
    const sushi = Math.min(val - uniswap, val * 0.3);
    const curve = val - uniswap - sushi;
    return [
      { name: 'Uniswap V3', amount: uniswap, color: 'bg-pink-500' },
      { name: 'SushiSwap', amount: sushi, color: 'bg-blue-500' },
      { name: 'Curve', amount: curve, color: 'bg-orange-500' },
    ];
  };

  const routes = calculateRoutes(parseFloat(amount) || 0);

  return (
    <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur" id="router">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <TrendingDown className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Deep Learning Order Router</h2>
          <p className="text-sm text-gray-400">Minimizing slippage via intelligent splitting</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-sm text-gray-400">Input Amount (ETH)</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="absolute right-4 top-3 text-gray-500">ETH</span>
          </div>
          
          <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-green-400">AI Optimization</span>
              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Active</span>
            </div>
            <p className="text-xs text-green-600/80">
              Projected savings: {((parseFloat(amount) || 0) * 0.004).toFixed(4)} ETH vs. single route
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Smart Route Execution</h3>
          {routes.map((route, i) => (
            <div key={route.name} className="relative group">
              <div className="flex justify-between text-xs mb-1 text-gray-300">
                <span>{route.name}</span>
                <span>{route.amount.toFixed(2)} ETH ({((route.amount / (parseFloat(amount)||1)) * 100).toFixed(0)}%)</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${route.color} transition-all duration-500 ease-out`}
                  style={{ width: `${(route.amount / (parseFloat(amount)||1)) * 100}%` }}
                />
              </div>
            </div>
          ))}
          
          <div className="pt-4 flex items-center justify-between text-sm border-t border-gray-800 mt-4">
            <span className="text-gray-500">Total Executed</span>
            <span className="font-mono text-white">{parseFloat(amount).toFixed(2)} ETH</span>
          </div>
        </div>
      </div>
    </div>
  );
}

