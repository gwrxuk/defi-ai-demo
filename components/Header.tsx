import React from 'react';
import { BrainCircuit, Activity, Network } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-blue-500" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            DeFi AI Nexus
          </h1>
        </div>
        <nav className="flex gap-6 text-sm text-gray-400">
          <a href="#router" className="hover:text-blue-400 transition-colors flex items-center gap-2">
            <Network className="w-4 h-4" /> Order Router
          </a>
          <a href="#analytics" className="hover:text-purple-400 transition-colors flex items-center gap-2">
            <Activity className="w-4 h-4" /> AI Analytics
          </a>
        </nav>
      </div>
    </header>
  );
}

