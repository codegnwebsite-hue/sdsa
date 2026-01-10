
import React from 'react';
import { MessageCircle, Lock, ChevronRight, ShieldAlert, Zap, Users, Globe, BarChart3 } from 'lucide-react';
import { APP_CONFIG } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#0a0a0b] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-6xl mx-auto pt-24 pb-12">
        <div className="mb-10 animate-float inline-flex items-center space-x-2 px-5 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Lock className="w-3.5 h-3.5" />
          <span>Official Verification Gateway</span>
        </div>

        <h1 className="text-6xl md:text-9xl font-bold mb-8 tracking-tighter leading-[0.9] text-white italic">
          ELITE <br/><span className="gradient-text">GAMING</span>
        </h1>
        
        <p className="text-gray-400 max-w-2xl text-lg md:text-xl leading-relaxed mb-16 font-medium">
          The ultimate destination for competitive players. Secure your spot in the <span className="text-white font-bold">{APP_CONFIG.SERVER_NAME}</span> by completing our multi-layer authentication protocol.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-2xl">
          <a 
            href={APP_CONFIG.DISCORD_INVITE} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center space-x-3 bg-white text-black font-black py-5 px-10 rounded-2xl transition-all hover:bg-indigo-50 active:scale-95 shadow-2xl w-full md:w-auto"
          >
            <span className="uppercase tracking-tighter text-lg">Join Discord</span>
            <MessageCircle className="w-6 h-6" />
          </a>
          <div className="flex items-center space-x-4 bg-white/5 border border-white/10 py-5 px-8 rounded-2xl text-gray-400 font-bold uppercase text-xs tracking-widest">
            <Zap className="w-5 h-5 text-indigo-500" />
            <span>Active Verification Required</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="w-full bg-white/5 border-y border-white/5 backdrop-blur-md py-12 mb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Verified Members', value: APP_CONFIG.STATS.VERIFIED_USERS, icon: Users },
            { label: 'System Uptime', value: APP_CONFIG.STATS.UPTIME, icon: Globe },
            { label: 'Encryption', value: APP_CONFIG.STATS.PROTECTION, icon: Lock },
            { label: 'Avg. Auth Time', value: APP_CONFIG.STATS.AVG_TIME, icon: BarChart3 },
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start space-x-2 text-indigo-500">
                <stat.icon className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{stat.label}</span>
              </div>
              <p className="text-3xl font-black italic text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-10 rounded-[2.5rem] border-white/5 group hover:border-indigo-500/30 transition-all duration-500">
            <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform">
              <ShieldAlert className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Anti-Bot Protocol</h3>
            <p className="text-gray-500 leading-relaxed text-sm">Our 3-step verification system ensures that only genuine human players gain access to the community lobbies.</p>
          </div>

          <div className="glass p-10 rounded-[2.5rem] border-white/5 group hover:border-purple-500/30 transition-all duration-500 animate-float-delayed">
            <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-8 group-hover:-rotate-6 transition-transform">
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Instant Role Sync</h3>
            <p className="text-gray-500 leading-relaxed text-sm">Once verified, roles are instantly assigned via our secure high-speed Discord Webhook integration.</p>
          </div>

          <div className="glass p-10 rounded-[2.5rem] border-white/5 group hover:border-blue-500/30 transition-all duration-500">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Stateless Security</h3>
            <p className="text-gray-500 leading-relaxed text-sm">We use encrypted URL slugs to maintain session integrity without storing sensitive user data on our servers.</p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="w-full max-w-4xl mx-auto px-6 pb-32 text-center relative z-10">
        <div className="glass p-12 rounded-[3.5rem] border-white/5 bg-gradient-to-br from-white/5 to-transparent">
          <h2 className="text-4xl font-bold mb-6 italic uppercase tracking-tighter">Ready to dominate?</h2>
          <p className="text-gray-400 mb-10 max-w-md mx-auto">Join thousands of elite players today. Use <code className="text-indigo-400 font-mono">/verify</code> in our Discord server.</p>
          <a 
            href={APP_CONFIG.DISCORD_INVITE} 
            className="inline-flex items-center space-x-3 bg-indigo-600 text-white font-black py-4 px-12 rounded-2xl hover:bg-indigo-500 transition-all shadow-[0_20px_40px_rgba(79,70,229,0.3)] active:scale-95"
          >
            <span>START YOUR JOURNEY</span>
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
