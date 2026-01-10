
import React from 'react';
import { MessageCircle, Lock, ChevronRight, ShieldAlert } from 'lucide-react';
import { APP_CONFIG } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[85vh] bg-[#0a0a0b] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto py-12">
        {/* Access Badge */}
        <div className="mb-10 inline-flex items-center space-x-2 px-5 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Lock className="w-3.5 h-3.5" />
          <span>Access Restricted</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tight leading-[1.1] text-white">
          Welcome to <span className="gradient-text">{APP_CONFIG.SERVER_NAME}</span>
        </h1>
        
        {/* Description Text */}
        <p className="text-gray-400 max-w-2xl text-lg md:text-xl leading-relaxed mb-16 font-medium">
          Verification links are now exclusive. To get started, you must <span className="text-white font-bold">join our Discord server</span> and use the <code className="bg-white/10 px-2 py-1 rounded text-indigo-300 font-mono text-base">/verify</code> command to generate your unique link.
        </p>
        
        {/* Ready to Join Card */}
        <div className="w-full max-w-md glass p-10 rounded-[2.5rem] border-white/5 shadow-2xl transition-transform hover:scale-[1.02] duration-500">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
               <MessageCircle className="w-8 h-8 text-white opacity-80" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3">Ready to join?</h3>
          <p className="text-gray-500 text-sm mb-8">Join our Discord server to generate a link.</p>
          
          <a 
            href={APP_CONFIG.DISCORD_INVITE} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center space-x-3 bg-white text-black font-black py-4 px-8 rounded-2xl transition-all hover:bg-indigo-50 active:scale-95 shadow-xl w-full"
          >
            <span className="uppercase tracking-tighter">Join Discord Now</span>
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>

        {/* Security Footer Note */}
        <div className="mt-12 flex items-center space-x-2 text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">
          <ShieldAlert className="w-4 h-4" />
          <span>Secured by VerifyPro Gatekeeper</span>
        </div>
      </div>
    </div>
  );
};

export default Home;