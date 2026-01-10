
import React from 'react';
import { MessageCircle, Lock, ShieldCheck, Zap, Users, Globe, BarChart3, Terminal, Activity, ChevronRight, Fingerprint } from 'lucide-react';
import { APP_CONFIG } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-transparent relative">
      {/* Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-16 pb-24">
        {/* Main Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Side: Refined Hero Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-8 py-8">
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">System Deployment v2.5.4</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.1] uppercase italic">
                Professional <span className="gradient-text">Identity</span><br />
                Gateway Protocol.
              </h1>
              <p className="text-gray-500 max-w-xl text-base md:text-lg leading-relaxed font-medium">
                The most secure verification layer for <span className="text-white font-bold">{APP_CONFIG.SERVER_NAME}</span>. Automated role assignment with sub-second sync latency and hardware signature validation.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a 
                href={APP_CONFIG.DISCORD_INVITE} 
                className="flex items-center space-x-3 bg-white text-black font-black py-4 px-8 rounded-2xl transition-all hover:bg-gray-200 active:scale-95 shadow-lg"
              >
                <span className="text-xs tracking-widest uppercase">Access Discord</span>
                <MessageCircle className="w-4 h-4" />
              </a>
              <div className="flex items-center space-x-4 bg-white/5 border border-white/10 px-6 rounded-2xl text-gray-400 font-bold text-[10px] tracking-[0.2em] uppercase">
                <Fingerprint className="w-4 h-4 text-indigo-500" />
                <span>AES-256 Validated</span>
              </div>
            </div>

            {/* Live Monitoring Dashboard Preview */}
            <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Verified', value: APP_CONFIG.STATS.VERIFIED_USERS, icon: Users },
                { label: 'Uptime', value: APP_CONFIG.STATS.UPTIME, icon: Activity },
                { label: 'Latency', value: APP_CONFIG.STATS.AVG_TIME, icon: Zap },
                { label: 'Security', value: APP_CONFIG.STATS.PROTECTION, icon: Lock },
              ].map((stat, i) => (
                <div key={i} className="glass p-5 rounded-2xl border-white/5 group hover:bg-white/[0.03] transition-colors">
                  <stat.icon className="w-4 h-4 text-indigo-400 mb-3" />
                  <p className="text-xl font-black text-white tracking-tighter italic">{stat.value}</p>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Visual Element / Feature Card (5 Cols) */}
          <div className="lg:col-span-5 pt-8">
            <div className="glass rounded-[2.5rem] p-8 border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Terminal className="w-48 h-48 text-white rotate-12" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-600 p-2.5 rounded-xl">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-black text-sm uppercase tracking-widest">Gateway Health</span>
                  </div>
                  <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase">Operational</span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      <span>Verification Throughput</span>
                      <span className="text-white">94% Capacity</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 w-[94%] shadow-[0_0_10px_#4f46e5]"></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-xs font-bold text-gray-400 italic">
                      <ChevronRight className="w-3 h-3 text-indigo-500" />
                      <span>Request filtering active...</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs font-bold text-gray-400 italic">
                      <ChevronRight className="w-3 h-3 text-indigo-500" />
                      <span>Hardware tokens synced...</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs font-bold text-gray-400 italic">
                      <ChevronRight className="w-3 h-3 text-indigo-500" />
                      <span>Role mapping verified.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                   <button className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-colors">
                     View System Logs
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Bottom Row */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { 
               title: "Automated Handshake", 
               desc: "No manual verification needed. Our bot syncs roles the moment you complete the protocol.",
               icon: Zap
             },
             { 
               title: "Regional Relays", 
               desc: "Global distribution points ensure that your verification is lightning fast regardless of location.",
               icon: Globe
             },
             { 
               title: "Entity Encryption", 
               desc: "Your data is hashed and salted using industry-leading AES-256 encryption standards.",
               icon: Lock
             }
           ].map((feature, i) => (
             <div key={i} className="space-y-4 p-4 hover:translate-y-[-4px] transition-transform">
               <div className="bg-indigo-600/10 w-12 h-12 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                 <feature.icon className="w-5 h-5 text-indigo-500" />
               </div>
               <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">{feature.title}</h3>
               <p className="text-sm text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Home;