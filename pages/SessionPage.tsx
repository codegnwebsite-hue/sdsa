
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Shield, Loader2, Ticket, AlertCircle, Home, Clock, ChevronRight, User, Terminal, Key, Zap } from 'lucide-react';
import { APP_CONFIG } from '../constants';

interface SessionData {
  cp1: boolean;
  cp2: boolean;
  lastClickTime?: number;
  lastStep?: number;
  uid?: string;
  service?: string;
  createdAt: number;
}

const SessionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(APP_CONFIG.VERIFY_WINDOW_MS);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!slug) return;
    
    // Auth directly from the Slug token to prevent resets on refresh
    let metaData: { uid: string, service: string, createdAt: number } | null = null;
    if (slug.startsWith('u_')) {
      try {
        const base64 = slug.substring(2);
        const decoded = atob(base64);
        const [uid, service, timestamp] = decoded.split(':');
        metaData = {
          uid,
          service,
          createdAt: parseInt(timestamp) || Date.now()
        };
      } catch (e) {
        console.error("Token decode error", e);
      }
    }

    if (!metaData) {
      setLoading(false);
      return;
    }

    const stored = localStorage.getItem(`session_${slug}`);
    let currentSession: SessionData;

    if (stored) {
      const storedData = JSON.parse(stored);
      currentSession = {
        ...storedData,
        // Always enforce metadata from URL to keep timer persistent and authority solid
        uid: metaData.uid,
        service: metaData.service,
        createdAt: metaData.createdAt
      };
    } else {
      currentSession = {
        uid: metaData.uid,
        service: metaData.service,
        createdAt: metaData.createdAt,
        cp1: false,
        cp2: false
      };
    }
    
    localStorage.setItem(`session_${slug}`, JSON.stringify(currentSession));
    localStorage.setItem('active_session_slug', slug);
    setSession(currentSession);
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    if (!session || isExpired) return;
    const tick = () => {
      // Calculate remaining time strictly from session.createdAt (the token timestamp)
      const elapsed = Date.now() - session.createdAt;
      const remaining = APP_CONFIG.VERIFY_WINDOW_MS - elapsed;
      
      if (remaining <= 0) { 
        setIsExpired(true); 
        setTimeLeft(0); 
      } else { 
        setTimeLeft(remaining); 
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [session, isExpired]);

  const handleCheckpoint = (step: number) => {
    if (!slug || !session || isExpired) return;
    const updated = { ...session, lastClickTime: Date.now(), lastStep: step };
    localStorage.setItem(`session_${slug}`, JSON.stringify(updated));
    setSession(updated);
    window.location.href = step === 1 ? APP_CONFIG.CHECKPOINT_1_LINK : APP_CONFIG.CHECKPOINT_2_LINK;
  };

  const formatTime = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
      <span className="text-xs font-black uppercase tracking-widest text-gray-500">Initializing Session...</span>
    </div>
  );

  if (!session || isExpired) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="glass p-12 rounded-[2.5rem] border-red-500/20 shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-8 opacity-40" />
          <h2 className="text-2xl font-black italic uppercase mb-4 tracking-tighter">
            {isExpired ? "Session Expired" : "Access Denied"}
          </h2>
          <p className="text-gray-500 text-sm mb-10 leading-relaxed px-4">
            Verification sessions are valid for 30 minutes. Please return to Discord to generate a fresh link.
          </p>
          <Link to="/" className="inline-flex items-center space-x-3 bg-white text-black font-black py-4 px-10 rounded-2xl text-xs uppercase tracking-widest shadow-xl hover:bg-gray-200 transition-colors">
            <Home className="w-4 h-4" />
            <span>Portal Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Horizontal Identity Card Layout */}
      <div className="glass rounded-[2rem] overflow-hidden shadow-2xl border-white/5 relative flex flex-col md:flex-row min-h-[340px]">
        
        {/* Left Sidebar - Identity Metadata (1/3 breadth) */}
        <div className="bg-white/[0.03] border-b md:border-b-0 md:border-r border-white/5 p-8 flex flex-col justify-between w-full md:w-80">
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/30">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">Identity Card</span>
                <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest">v2.5 Protocol</span>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <User className="w-3 h-3" /> Authenticated UID
                </span>
                <span className="text-sm font-mono font-bold text-white bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{session.uid}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> Target Service
                </span>
                <span className="text-sm font-bold text-white uppercase italic tracking-tight">{session.service}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Terminal className="w-3 h-3" /> Session Key
                </span>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-indigo-400/70 bg-black/40 p-2.5 rounded-lg border border-white/5 overflow-hidden">
                   <Key className="w-3 h-3 flex-shrink-0" />
                   <span className="truncate">{slug}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-2.5">
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Time Buffer</span>
               <Clock className={`w-3.5 h-3.5 ${timeLeft < 300000 ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`} />
            </div>
            <div className={`text-3xl font-mono font-black tracking-tighter ${timeLeft < 300000 ? 'text-red-500' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
               <div 
                 className={`h-full transition-all duration-1000 ${timeLeft < 300000 ? 'bg-red-600 shadow-[0_0_12px_#dc2626]' : 'bg-indigo-600 shadow-[0_0_12px_#4f46e5]'}`}
                 style={{ width: `${(timeLeft / APP_CONFIG.VERIFY_WINDOW_MS) * 100}%` }}
               />
            </div>
          </div>
        </div>

        {/* Right Content Area - Action & Sequential Steps (2/3 breadth) */}
        <div className="flex-1 p-10 flex flex-col justify-center items-center text-center bg-gradient-to-br from-transparent to-white/[0.01]">
          {!session.cp1 ? (
            /* STEP 1 */
            <div className="w-full animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="inline-block px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-6 italic">Sequence 01</div>
              <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic leading-none">Primary Checkpoint</h3>
              <p className="text-gray-400 text-sm mb-10 leading-relaxed max-w-sm mx-auto font-medium">
                Our initial security filter requires a manual validation. Proceed to Step 1 to authorize your session.
              </p>
              <button 
                onClick={() => handleCheckpoint(1)}
                className="group flex items-center justify-center space-x-4 bg-white text-black font-black py-5 px-14 rounded-2xl transition-all shadow-2xl hover:bg-gray-200 active:scale-95 w-full max-w-xs mx-auto"
              >
                <span className="text-sm uppercase tracking-[0.2em]">Begin Step 1</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          ) : !session.cp2 ? (
            /* STEP 2 */
            <div className="w-full animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="inline-block px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] mb-6 italic">Sequence 02</div>
              <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic leading-none">Final Authorization</h3>
              <p className="text-gray-400 text-sm mb-10 leading-relaxed max-w-sm mx-auto font-medium">
                Checkpoint 1 verified. Please complete the final layer of authorization to synchronize your permissions.
              </p>
              <button 
                onClick={() => handleCheckpoint(2)}
                className="group flex items-center justify-center space-x-4 bg-white text-black font-black py-5 px-14 rounded-2xl transition-all shadow-2xl hover:bg-gray-200 active:scale-95 w-full max-w-xs mx-auto"
              >
                <span className="text-sm uppercase tracking-[0.2em]">Complete Step 2</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          ) : (
            /* STEP 3 (SUCCESS) */
            <div className="w-full animate-in zoom-in-95 duration-700">
              <div className="w-24 h-24 bg-green-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.15)] animate-float">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-5xl font-black text-white mb-2 uppercase tracking-tighter italic leading-none">STEP 3 COMPLETE</h3>
              <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.4em] mb-10">Verification Successful</p>
              
              <div className="bg-indigo-600/10 border-2 border-indigo-500/20 rounded-[2rem] p-8 mb-10 flex flex-col md:flex-row items-center gap-6 text-left max-w-lg mx-auto shadow-xl">
                <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-600/40">
                  <Ticket className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="text-white font-black text-2xl italic uppercase tracking-tighter leading-none mb-2">Check Server Ticket</p>
                  <p className="text-sm text-gray-400 leading-relaxed font-semibold">
                    Your identity is now synchronized. Please <span className="text-white">return to your Discord support ticket</span>. Our automation is currently updating your roles.
                  </p>
                </div>
              </div>

              <a 
                href={APP_CONFIG.DISCORD_INVITE}
                className="inline-flex items-center space-x-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black py-5 px-16 rounded-2xl transition-all active:scale-95 shadow-2xl shadow-[#5865F2]/30 text-xs uppercase tracking-[0.2em]"
              >
                <span>Return to Discord</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Security Breadth Footer */}
      <div className="mt-12 flex items-center justify-center space-x-6 text-gray-600 opacity-60">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
        <div className="flex items-center space-x-3">
          <Shield className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">AES-256 ENCRYPTED GATEWAY</span>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
      </div>
    </div>
  );
};

export default SessionPage;
