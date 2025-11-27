"use client";

import React, { useState, useEffect } from 'react';
import { Users, Zap, ShieldCheck } from 'lucide-react';

type Agent = {
  id: string;
  role: 'Arbitrageur' | 'Liquidity Provider' | 'Market Maker';
  status: 'Idle' | 'Scanning' | 'Trading' | 'Validating';
  color: string;
};

const AGENTS: Agent[] = [
  { id: '0x3f...1a', role: 'Arbitrageur', status: 'Scanning', color: 'bg-red-500' },
  { id: '0x7b...9c', role: 'Liquidity Provider', status: 'Idle', color: 'bg-blue-500' },
  { id: '0xa1...22', role: 'Market Maker', status: 'Trading', color: 'bg-green-500' },
  { id: '0x88...dd', role: 'Arbitrageur', status: 'Scanning', color: 'bg-red-500' },
  { id: '0x44...ff', role: 'Liquidity Provider', status: 'Validating', color: 'bg-blue-500' },
];

export function MultiAgentSim() {
  const [agents, setAgents] = useState(AGENTS);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update agent status
      setAgents(prev => prev.map(a => ({
        ...a,
        status: Math.random() > 0.7 ? 
          (['Idle', 'Scanning', 'Trading', 'Validating'][Math.floor(Math.random() * 4)] as any) 
          : a.status
      })));

      // Randomly add log
      if (Math.random() > 0.6) {
        const action = [
          "detected price discrepancy on Uniswap",
          "provided liquidity to ETH-USDC pool",
          "executed flash loan arbitrage",
          "verified reputation via ERC-8004",
          "negotiated trade via A2A protocol"
        ][Math.floor(Math.random() * 5)];
        const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)].id;
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] Agent ${agent} ${action}`, ...prev.slice(0, 4)]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <Users className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Multi-Agent Market Simulation</h2>
          <p className="text-sm text-gray-400">Autonomous agents coordinating on-chain</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="grid grid-cols-1 gap-3">
          {agents.map((agent, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-gray-800">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${agent.color} ${agent.status === 'Trading' ? 'animate-pulse' : ''}`} />
                <div>
                  <div className="text-sm font-mono text-gray-300">{agent.id}</div>
                  <div className="text-xs text-gray-500">{agent.role}</div>
                </div>
              </div>
              <div className={`text-xs px-2 py-1 rounded border ${
                agent.status === 'Trading' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                agent.status === 'Scanning' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                'border-gray-700 text-gray-400'
              }`}>
                {agent.status}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-black/60 rounded-lg p-4 font-mono text-xs overflow-hidden border border-gray-800">
          <div className="flex items-center gap-2 text-gray-500 mb-3 border-b border-gray-800 pb-2">
            <ShieldCheck size={14} />
            <span>On-Chain Event Log</span>
          </div>
          <div className="space-y-2">
            {logs.map((log, i) => (
              <div key={i} className="text-gray-300 animate-in fade-in slide-in-from-left-2">
                <span className="text-blue-500">{'>'}</span> {log}
              </div>
            ))}
            {logs.length === 0 && <span className="text-gray-600 italic">Waiting for activity...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

