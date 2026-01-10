
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Server, Home, Info, ShoppingCart, MessageSquare } from 'lucide-react';
import { APP_CONFIG } from '../constants';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 group">
          <img 
            src={APP_CONFIG.SERVER_ICON} 
            alt="CodeG3N" 
            className="w-10 h-10 rounded-xl group-hover:rotate-6 transition-all shadow-lg"
          />
          <span className="font-black text-2xl tracking-tighter hidden sm:block italic uppercase">CODE<span className="text-indigo-500">G3N</span></span>
        </Link>
        
        <div className="flex items-center space-x-6 md:space-x-10">
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-1.5 text-[10px] font-black text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em]">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <Link to="/info" className="flex items-center space-x-1.5 text-[10px] font-black text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em]">
              <Info className="w-3.5 h-3.5" />
              <span>Info</span>
            </Link>
            <Link to="/contact" className="flex items-center space-x-1.5 text-[10px] font-black text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em]">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact</span>
            </Link>
            <Link to="/shop" className="flex items-center space-x-1.5 text-[10px] font-black text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em]">
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Shop</span>
            </Link>
          </div>
          
          <a 
            href={APP_CONFIG.DISCORD_INVITE} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-indigo-50 transition-transform active:scale-95 shadow-xl hidden sm:block"
          >
            Join Discord
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
