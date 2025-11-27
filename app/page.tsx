import { Header } from '@/components/Header';
import { SmartOrderRouter } from '@/components/SmartOrderRouter';
import { AiAnalytics } from '@/components/AiAnalytics';
import { MultiAgentSim } from '@/components/MultiAgentSim';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Next-Gen DeFi Trading Infrastructure
          </h2>
          <p className="text-gray-400">
            Demonstrating AI-driven order routing, multimodal analytics, and autonomous multi-agent coordination inspired by recent academic advances.
          </p>
        </div>

        <SmartOrderRouter />
        <AiAnalytics />
        <MultiAgentSim />

        <footer className="pt-12 pb-6 text-center text-gray-600 text-sm">
          <p>Prototype based on "Advances in AI for Decentralized Finance Trading"</p>
        </footer>
      </main>
    </div>
  );
}
