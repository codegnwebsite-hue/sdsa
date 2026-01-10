
import React from 'react';
import { MessageCircle, Lock, ChevronRight, ShieldCheck, Zap, Users, Globe, BarChart3 } from 'lucide-react';
import { APP_CONFIG } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#0a0a0b] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto pt-16 pb-10">
        <div className="mb-6 inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[9px] font-bold uppercase tracking-[0.2em]">
          <ShieldCheck className="w-3 h-3" />
          <span>Gateway v2.5 Stable</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-[1.1] text-white">
          Secure Your <br/><span className="gradient-text">Gaming Identity</span>
        </h1>
        
        <p className="text-gray-400 max-w-lg text-sm md:text-base leading-relaxed mb-8">
          The industry-standard verification layer for <span className="text-white font-semibold">{APP_CONFIG.SERVER_NAME}</span>. Fast, secure, and fully automated.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <a 
            href={APP_CONFIG.DISCORD_INVITE} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center space-x-2 bg-white text-black font-bold py-3.5 px-8 rounded-xl transition-all hover:bg-gray-200 active:scale-95 shadow-lg w-full sm:w-auto"
          >
            <span className="text-xs uppercase tracking-widest">Join Discord</span>
            <MessageCircle className="w-4 h-4" />
          </a>
          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 py-3.5 px-6 rounded-xl text-gray-400 font-semibold text-[10px] tracking-wider uppercase">
            <Zap className="w-3 h-3 text-indigo-500" />
            <span>Instant Access</span>
          </div>
        </div>
      </div>

      {/* Grid-based Stats - More compact */}
      <div className="w-full max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { label: 'Users', value: APP_CONFIG.STATS.VERIFIED_USERS, icon: Users },
          { label: 'Uptime', value: APP_CONFIG.STATS.UPTIME, icon: Globe },
          { label: 'Security', value: APP_CONFIG.STATS.PROTECTION, icon: Lock },
          { label: 'Sync', value: APP_CONFIG.STATS.AVG_TIME, icon: BarChart3 },
        ].map((stat, i) => (
          <div key={i} className="glass p-5 rounded-xl border-white/5 flex flex-col items-center">
            <stat.icon className="w-4 h-4 text-indigo-500 mb-2 opacity-60" />
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Features Grid - Small cards */}
      <div className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Smart Filter", desc: "Advanced heuristic analysis blocks automated scripts." },
          { title: "Encrypted Sync", desc: "Your session is protected with end-to-end encryption." },
          { title: "Global CDN", desc: "Localized nodes ensure sub-second response times." }
        ].map((f, i) => (
          <div key={i} className="glass p-6 rounded-2xl border-white/5">
            <h3 className="text-sm font-bold mb-2 text-white uppercase tracking-tight">{f.title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
