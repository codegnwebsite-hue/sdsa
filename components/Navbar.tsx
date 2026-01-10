
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Server, Home } from 'lucide-react';
import { APP_CONFIG } from '../constants';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:bg-indigo-500 transition-all group-hover:rotate-6 shadow-lg shadow-indigo-600/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter hidden sm:block italic">VERIFY<span className="text-indigo-500">PRO</span></span>
        </Link>
        
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-1 text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <a href={APP_CONFIG.DISCORD_INVITE} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
            <Server className="w-4 h-4" />
            <span>Discord</span>
          </a>
          <a 
            href={APP_CONFIG.DISCORD_INVITE} 
            className="bg-white text-black px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter hover:bg-indigo-50 transition-transform active:scale-95 shadow-xl"
          >
            Join Now
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
