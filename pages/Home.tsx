
import React from 'react';
import { MessageCircle, Lock, ChevronRight, ShieldCheck, Zap, Users, Globe, BarChart3 } from 'lucide-react';
import { APP_CONFIG } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#0a0a0b] relative overflow-hidden">
      {/* Epic Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Hero Section - Bold & Big */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-6xl mx-auto pt-24 pb-16">
        <div className="mb-8 inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-black uppercase tracking-[0.3em] animate-pulse">
          <ShieldCheck className="w-4 h-4" />
          <span>Gateway v2.5 Deployment Active</span>
        </div>

        <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.9] text-white italic uppercase">
          SECURE YOUR <br/><span className="gradient-text">GAMING IDENTITY</span>
        </h1>
        
        <p className="text-gray-400 max-w-2xl text-lg md:text-xl leading-relaxed mb-12 font-medium">
          The industry-standard verification layer for <span className="text-white font-bold">{APP_CONFIG.SERVER_NAME}</span>. Experience sub-second authentication with military-grade encryption.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-lg">
          <a 
            href={APP_CONFIG.DISCORD_INVITE} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center space-x-3 bg-white text-black font-black py-5 px-10 rounded-2xl transition-all hover:bg-gray-200 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] w-full sm:w-auto"
          >
            <span className="text-sm tracking-widest uppercase">Join Community</span>
            <MessageCircle className="w-5 h-5" />
          </a>
          <div className="flex items-center space-x-4 bg-white/5 border border-white/10 py-5 px-8 rounded-2xl text-gray-400 font-black text-xs tracking-widest uppercase">
            <Zap className="w-4 h-4 text-indigo-500" />
            <span>Instant Auth</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
        {[
          { label: 'Verified Entities', value: APP_CONFIG.STATS.VERIFIED_USERS, icon: Users },
          { label: 'Uptime Relay', value: APP_CONFIG.STATS.UPTIME, icon: Globe },
          { label: 'Protection Level', value: APP_CONFIG.STATS.PROTECTION, icon: Lock },
          { label: 'Sync Latency', value: APP_CONFIG.STATS.AVG_TIME, icon: BarChart3 },
        ].map((stat, i) => (
          <div key={i} className="glass p-8 rounded-3xl border-white/5 flex flex-col items-center md:items-start group hover:border-indigo-500/30 transition-colors">
            <stat.icon className="w-6 h-6 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-3xl font-black text-white mb-1 tracking-tighter italic">{stat.value}</p>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
