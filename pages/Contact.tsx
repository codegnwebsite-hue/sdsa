
import React from 'react';
import { MessageSquare, ExternalLink, ShieldAlert } from 'lucide-react';
import { APP_CONFIG } from '../constants';

const Contact: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <div className="glass rounded-[3rem] p-12 border-white/5 space-y-8">
        <div className="bg-indigo-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
           <MessageSquare className="w-8 h-8 text-white" />
        </div>
        
        <div className="space-y-4">
           <h1 className="text-4xl font-black uppercase italic tracking-tighter">Contact Support</h1>
           <p className="text-gray-500 font-medium uppercase tracking-tight text-sm px-10">
              Technical support and general inquiries are handled exclusively via our Discord server.
           </p>
        </div>

        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-left">
           <div className="flex items-center gap-3 mb-4 text-indigo-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-sm font-black uppercase tracking-widest">Support Protocol</h3>
           </div>
           <ul className="space-y-3 text-xs text-gray-500 uppercase tracking-tight font-bold">
              <li className="flex gap-2">• Join the CodeG3N Discord Server</li>
              <li className="flex gap-2">• Navigate to the #support channel</li>
              <li className="flex gap-2">• Open a support ticket to speak with staff</li>
           </ul>
        </div>

        <div className="pt-4">
           <a 
              href={APP_CONFIG.DISCORD_INVITE} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-white text-black font-black py-4 px-10 rounded-2xl transition-all hover:bg-gray-200 active:scale-95 shadow-xl text-xs tracking-widest uppercase italic"
           >
              <span>Join Discord Server</span>
              <ExternalLink className="w-4 h-4" />
           </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
