
import React from 'react';
import { MessageCircle, Lock, ShieldCheck, Zap, Users, ChevronRight, Fingerprint, Bot, Cpu, CheckCircle2 } from 'lucide-react';
import { APP_CONFIG } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-transparent relative">
      {/* Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-16 pb-24">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-32">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Automated Discord Bots • Free Generations</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1] uppercase italic">
                CODE<span className="gradient-text">G3N</span>
              </h1>
              <p className="text-gray-500 max-w-xl text-lg leading-relaxed font-medium">
                CodeG3N is a Discord-based platform powered by custom bots that allow users to generate free accounts and cookies for popular services like Netflix, Xbox, Disney+, and more.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a 
                href={APP_CONFIG.DISCORD_INVITE} 
                className="flex items-center space-x-3 bg-white text-black font-black py-4 px-10 rounded-2xl transition-all hover:bg-gray-200 active:scale-95 shadow-lg"
              >
                <span className="text-xs tracking-widest uppercase italic">Join our Discord Server</span>
                <MessageCircle className="w-4 h-4" />
              </a>
              <div className="flex items-center space-x-4 bg-white/5 border border-white/10 px-6 rounded-2xl text-gray-400 font-bold text-[10px] tracking-[0.2em] uppercase">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>Secure Verification</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="glass rounded-[2.5rem] p-8 border-white/5 shadow-2xl relative overflow-hidden">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 pb-6 border-b border-white/5">
                   <img src={APP_CONFIG.SERVER_ICON} className="w-16 h-16 rounded-2xl shadow-xl border border-white/10" alt="Server Icon" />
                   <div>
                      <h3 className="font-black uppercase italic text-xl tracking-tighter">CodeG3N Protocol</h3>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Bot-Driven Ecosystem</p>
                   </div>
                </div>
                
                <div className="space-y-4">
                   <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <Bot className="w-6 h-6 text-indigo-500" />
                      <div>
                         <p className="text-xs font-black uppercase italic">Automated Bots</p>
                         <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Instant Generation</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <Cpu className="w-6 h-6 text-indigo-500" />
                      <div>
                         <p className="text-xs font-black uppercase italic">Custom commands</p>
                         <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">User-Friendly Interface</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Explanation */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Bots & Generation System</h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Automated Bots", desc: "CodeG3N uses automated Discord bots for every transaction.", icon: Bot },
              { title: "Bot Commands", desc: "Users generate services using simple slash commands.", icon: Zap },
              { title: "Instant Services", desc: "Includes free accounts and cookies for top platforms.", icon: CheckCircle2 },
              { title: "Instant Delivery", desc: "Generation is instant and sent directly to you.", icon: Cpu }
            ].map((item, idx) => (
              <div key={idx} className="glass p-8 rounded-[2rem] border-white/5 hover:bg-white/[0.03] transition-all group">
                <item.icon className="w-8 h-8 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-black uppercase italic tracking-tighter mb-2">{item.title}</h3>
                <p className="text-gray-500 text-xs font-medium leading-relaxed uppercase tracking-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32 items-center">
          <div className="space-y-6">
             <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">How Generation Works</h2>
             <p className="text-gray-500 font-medium">Follow our simple bot-driven protocol to start generating services instantly.</p>
             <div className="space-y-4 pt-4">
                {[
                  "Join the CodeG3N Discord server",
                  "Complete website verification",
                  "Use bot commands to generate services",
                  "Receive accounts or cookies"
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black group-hover:scale-110 transition-transform">{idx + 1}</div>
                    <span className="text-sm font-black uppercase tracking-tight italic text-gray-300">{step}</span>
                  </div>
                ))}
             </div>
             <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest pt-4 italic">Everything is fully automated by bots.</p>
          </div>
          <div className="glass p-10 rounded-[3rem] border-indigo-500/10 bg-indigo-500/[0.02]">
             <div className="flex items-center gap-4 mb-6">
                <Lock className="w-6 h-6 text-indigo-500" />
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Security & Fair Usage</h3>
             </div>
             <ul className="space-y-4">
                <li className="flex gap-3 text-xs font-medium text-gray-500 uppercase tracking-tight">
                  <div className="mt-1.5 w-1 h-1 bg-indigo-500 rounded-full flex-shrink-0"></div>
                  Verification is mandatory to protect the community.
                </li>
                <li className="flex gap-3 text-xs font-medium text-gray-500 uppercase tracking-tight">
                  <div className="mt-1.5 w-1 h-1 bg-indigo-500 rounded-full flex-shrink-0"></div>
                  Bots actively prevent abuse and multi-accounting.
                </li>
                <li className="flex gap-3 text-xs font-medium text-gray-500 uppercase tracking-tight">
                  <div className="mt-1.5 w-1 h-1 bg-indigo-500 rounded-full flex-shrink-0"></div>
                  Fair usage limits apply to ensure availability for all.
                </li>
             </ul>
          </div>
        </div>

        {/* Staff Section */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Staff / Team</h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Owner */}
            <div className="glass p-8 rounded-[2.5rem] text-center border-indigo-500/20 group hover:bg-indigo-500/[0.05] transition-all">
              <img 
                src="https://cdn.discordapp.com/avatars/1392539609707188264/d5fc620fa4a2311b8045a34d323f2793.png" 
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-indigo-500 shadow-xl group-hover:scale-105 transition-transform" 
                alt="Coder" 
              />
              <h4 className="text-lg font-black uppercase italic tracking-tighter">Coder</h4>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">coder.hm</p>
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-600 text-[8px] font-black uppercase tracking-tighter">Owner & Founder</span>
            </div>

            {/* Co-Owner 1 */}
            <div className="glass p-8 rounded-[2.5rem] text-center border-white/5 group hover:bg-white/[0.03] transition-all">
              <img 
                src="https://cdn.discordapp.com/avatars/1357280420353544262/d78f0b9814393c4158675715d67d17aa.png" 
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-gray-500 shadow-xl group-hover:scale-105 transition-transform" 
                alt="Rinxz" 
              />
              <h4 className="text-lg font-black uppercase italic tracking-tighter">Rinxz</h4>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">rinxz0586_84074</p>
              <span className="inline-block px-3 py-1 rounded-full bg-gray-800 text-[8px] font-black uppercase tracking-tighter">Co-Owner</span>
            </div>

            {/* Co-Owner 2 */}
            <div className="glass p-8 rounded-[2.5rem] text-center border-white/5 group hover:bg-white/[0.03] transition-all">
              <img 
                src="https://cdn.discordapp.com/avatars/1357280064886149171/8e0081792d25ecc27f0d1cf2986e5360.png" 
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-gray-500 shadow-xl group-hover:scale-105 transition-transform" 
                alt="ZoroXflash" 
              />
              <h4 className="text-lg font-black uppercase italic tracking-tighter">ZoroXflash</h4>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">flash077366</p>
              <span className="inline-block px-3 py-1 rounded-full bg-gray-800 text-[8px] font-black uppercase tracking-tighter">Co-Owner</span>
            </div>

            {/* Admin */}
            <div className="glass p-8 rounded-[2.5rem] text-center border-white/5 group hover:bg-white/[0.03] transition-all">
              <img 
                src="https://cdn.discordapp.com/avatars/1371938386599743538/a9c22147e5c3524e2ecabb5ffe928560.png" 
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-gray-600 shadow-xl group-hover:scale-105 transition-transform" 
                alt="Lisoo" 
              />
              <h4 className="text-lg font-black uppercase italic tracking-tighter">Lisoo</h4>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">lisoo_.1</p>
              <span className="inline-block px-3 py-1 rounded-full bg-gray-900 text-[8px] font-black uppercase tracking-tighter">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
