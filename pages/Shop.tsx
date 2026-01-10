
import React from 'react';
import { ShoppingCart, Timer } from 'lucide-react';

const Shop: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-40 text-center">
      <div className="glass rounded-[3rem] p-20 border-white/5 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <ShoppingCart className="w-40 h-40" />
        </div>
        
        <div className="bg-indigo-600/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-indigo-600/20">
           <Timer className="w-10 h-10 text-indigo-500 animate-pulse" />
        </div>
        
        <div className="space-y-4">
           <h1 className="text-6xl font-black uppercase italic tracking-tighter text-white">Shop</h1>
           <p className="text-indigo-500 font-black uppercase tracking-[0.5em] text-xl italic">Coming Soon</p>
        </div>
        
        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest max-w-xs mx-auto">
           Our premium service marketplace is currently under development. Stay tuned for updates in Discord.
        </p>
      </div>
    </div>
  );
};

export default Shop;
