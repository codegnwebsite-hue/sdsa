
import React from 'react';
import { MessageCircle, Lock, ChevronRight, ShieldCheck, Zap, Users, Globe, BarChart3 } from 'lucide-react';
import { APP_CONFIG } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#0a0a0b] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto pt-20 pb-12">
        <div className="mb-6 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Gateway v2.5 Stable</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1] text-white">
          Secure Your <br/><span className="gradient-text">Gaming Identity</span>
        </h1>
        
        <p className="text-gray-400 max-w-xl text-base md:text-lg leading-relaxed mb-10">
          The industry-standard verification layer for <span className="text-white font-semibold">{APP_CONFIG.SERVER_NAME}</span>. Fast, secure, and fully automated.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <a 
            href={APP_CONFIG.DISCORD_INVITE} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center space-x-2 bg-white text-black font-bold py-4 px-8 rounded-xl transition-all hover:bg-gray-200 active:scale-95 shadow-lg w-full sm:w-auto"
          >
            <span>JOIN DISCORD</span>
            <MessageCircle className="w-5 h-5" />
          </a>
          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 py-4 px-6 rounded-xl text-gray-400 font-semibold text-xs tracking-wider">
            <Zap className="w-4 h-4 text-indigo-500" />
            <span>INSTANT AUTHENTICATION</span>
          </div>
        </div>
      </div>

      {/* Simplified Stats Bar */}
      <div className="w-full max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {[
          { label: 'Active Users', value: APP_CONFIG.STATS.VERIFIED_USERS, icon: Users },
          { label: 'Network Uptime', value: APP_CONFIG.STATS.UPTIME, icon: Globe },
          { label: 'Security', value: APP_CONFIG.STATS.PROTECTION, icon: Lock },
          { label: 'Sync Speed', value: APP_CONFIG.STATS.AVG_TIME, icon: BarChart3 },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border-white/5 flex flex-col items-center md:items-start">
            <stat.icon className="w-5 h-5 text-indigo-500 mb-3" />
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Features Grid - More compact */}
      <div className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-3xl border-white/5">
          <h3 className="text-lg font-bold mb-3 text-white">Smart Bot Filter</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Advanced heuristic analysis to block automated scripts and ensure community purity.</p>
        </div>
        <div className="glass p-8 rounded-3xl border-white/5">
          <h3 className="text-lg font-bold mb-3 text-white">Encrypted Sync</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Your session is protected with end-to-end encryption. No personal data is stored.</p>
        </div>
        <div className="glass p-8 rounded-3xl border-white/5">
          <h3 className="text-lg font-bold mb-3 text-white">Global CDN</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Localized verification nodes worldwide ensure sub-second response times everywhere.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
