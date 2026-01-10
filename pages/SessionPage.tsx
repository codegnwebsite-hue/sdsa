
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Shield, Loader2, Ticket, AlertCircle, Home, Clock, ChevronRight, User, Terminal, Key, Zap, Fingerprint, RefreshCw } from 'lucide-react';
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
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(APP_CONFIG.VERIFY_WINDOW_MS);
  const [isExpired, setIsExpired] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Helper to decode base64 that might be missing padding
  const safeAtob = (str: string) => {
    try {
      // Add back padding if missing
      const padded = str.padEnd(str.length + (4 - str.length % 4) % 4, '=');
      return atob(padded);
    } catch (e) {
      console.error("Base64 decode error", e);
      return null;
    }
  };

  useEffect(() => {
    if (!slug) return;
    
    let metaData: { uid: string, service: string, createdAt: number } | null = null;
    if (slug.startsWith('u_')) {
      const base64 = slug.substring(2);
      const decoded = safeAtob(base64);
      if (decoded) {
        const parts = decoded.split(':');
        if (parts.length >= 3) {
          metaData = {
            uid: parts[0],
            service: parts[1],
            createdAt: parseInt(parts[2]) || Date.now()
          };
        }
      }
    }

    if (!metaData) {
      setLoading(false);
      return;
    }

    const storedKey = `session_${slug}`;
    const stored = localStorage.getItem(storedKey);
    let currentSession: SessionData;

    if (stored) {
      const storedData = JSON.parse(stored);
      currentSession = {
        ...storedData,
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
    
    localStorage.setItem(storedKey, JSON.stringify(currentSession));
    localStorage.setItem('active_session_slug', slug);
    setSession(currentSession);
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    if (!session || isExpired) return;
    const tick = () => {
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
    
    // Update local state to record the click
    const updated = { ...session, lastClickTime: Date.now(), lastStep: step };
    localStorage.setItem(`session_${slug}`, JSON.stringify(updated));
    setSession(updated);
    setIsSyncing(true);
    
    // Redirect to the external shortener link
    const targetLink = step === 1 ? APP_CONFIG.CHECKPOINT_1_LINK : APP_CONFIG.CHECKPOINT_2_LINK;
    
    // Use a small delay so the user sees the "Syncing" state before navigation
    setTimeout(() => {
      window.location.href = targetLink;
    }, 800);
  };

  // This function allows the user to manually trigger the "VerifyHandler" logic 
  // if the external shortener fails to redirect them back automatically.
  const manualSync = () => {
    if (!slug || !session?.lastStep) return;
    navigate(`/verify?slug=${slug}&step=${session.lastStep}`);
  };

  const formatTime = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
      <span className="text-xs font-black uppercase tracking-widest text-gray-500">Decrypting Identity...</span>
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
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="glass rounded-[2rem] overflow-hidden shadow-2xl border-white/5 relative flex flex-col md:flex-row min-h-[460px]">
        
        {/* Left Section - Sidebar Info */}
        <div className="bg-white/[0.03] border-b md:border-b-0 md:border-r border-white/5 p-10 flex flex-col justify-between w-full md:w-80">
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">Identity Card</span>
                <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest">Protocol v2.5</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Authenticated UID
                </span>
                <span className="text-sm font-mono font-bold text-white bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">{session.uid}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" /> Instance
                </span>
                <span className="text-sm font-bold text-white uppercase italic tracking-tight">{session.service}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" /> Session Key
                </span>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-indigo-400/80 bg-black/40 p-3 rounded-xl border border-white/5 overflow-hidden">
                   <Key className="w-3 h-3 flex-shrink-0" />
                   <span className="truncate">{slug}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Time Buffer</span>
               <Clock className={`w-4 h-4 ${timeLeft < 300000 ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`} />
            </div>
            <div className={`text-4xl font-mono font-black tracking-tighter ${timeLeft < 300000 ? 'text-red-500' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full mt-5 overflow-hidden">
               <div 
                 className={`h-full transition-all duration-1000 ${timeLeft < 300000 ? 'bg-red-600 shadow-[0_0_15px_#dc2626]' : 'bg-indigo-600 shadow-[0_0_15px_#4f46e5]'}`}
                 style={{ width: `${(timeLeft / APP_CONFIG.VERIFY_WINDOW_MS) * 100}%` }}
               />
            </div>
          </div>
        </div>

        {/* Right Section - Steps Content */}
        <div className="flex-1 p-12 flex flex-col justify-center items-center text-center bg-gradient-to-br from-transparent to-white/[0.01]">
          {isSyncing ? (
            <div className="w-full space-y-8 animate-in fade-in zoom-in-95 duration-300">
               <Loader2 className="w-20 h-20 animate-spin text-indigo-500 mx-auto" />
               <div>
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Redirecting...</h3>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Establishing Handshake with Gateway</p>
               </div>
            </div>
          ) : !session.cp1 ? (
            /* STEP 1 */
            <div className="w-full animate-in fade-in slide-in-from-right-10 duration-500">
              <div className="inline-block px-5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-8 italic">Stage 01: Initialization</div>
              <h3 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter italic leading-none">Authorization</h3>
              <p className="text-gray-400 text-base mb-12 leading-relaxed max-w-sm mx-auto font-medium">
                The initial handshake requires manual validation. Proceed to Step 1 to sync your session state.
              </p>
              
              <div className="space-y-4 max-w-sm mx-auto">
                <button 
                  onClick={() => handleCheckpoint(1)}
                  className="group flex items-center justify-center space-x-5 bg-white text-black font-black py-6 px-16 rounded-[2rem] transition-all shadow-2xl hover:bg-gray-200 active:scale-95 w-full"
                >
                  <span className="text-sm uppercase tracking-[0.3em]">Launch Step 1</span>
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
                {session.lastStep === 1 && (
                  <button onClick={manualSync} className="text-xs font-bold text-indigo-400 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto pt-4">
                    <RefreshCw className="w-3.5 h-3.5" /> Already clicked? Sync Status
                  </button>
                )}
              </div>
            </div>
          ) : !session.cp2 ? (
            /* STEP 2 */
            <div className="w-full animate-in fade-in slide-in-from-right-10 duration-500">
              <div className="inline-block px-5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-black text-purple-400 uppercase tracking-[0.4em] mb-8 italic">Stage 02: Verification</div>
              <h3 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter italic leading-none">Security Filter</h3>
              <p className="text-gray-400 text-base mb-12 leading-relaxed max-w-sm mx-auto font-medium">
                Authorization successful. Complete the secondary check to finalize your server permission set.
              </p>
              
              <div className="space-y-4 max-w-sm mx-auto">
                <button 
                  onClick={() => handleCheckpoint(2)}
                  className="group flex items-center justify-center space-x-5 bg-white text-black font-black py-6 px-16 rounded-[2rem] transition-all shadow-2xl hover:bg-gray-200 active:scale-95 w-full"
                >
                  <span className="text-sm uppercase tracking-[0.3em]">Launch Step 2</span>
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
                {session.lastStep === 2 && (
                  <button onClick={manualSync} className="text-xs font-bold text-indigo-400 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto pt-4">
                    <RefreshCw className="w-3.5 h-3.5" /> Already clicked? Sync Status
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* SUCCESS */
            <div className="w-full animate-in zoom-in-95 duration-700">
              <div className="w-28 h-28 bg-green-500/10 rounded-[3rem] flex items-center justify-center mx-auto mb-10 border border-green-500/20 shadow-[0_0_60px_rgba(34,197,94,0.2)] animate-float">
                <CheckCircle2 className="w-14 h-14 text-green-500" />
              </div>
              <h3 className="text-6xl font-black text-white mb-2 uppercase tracking-tighter italic leading-none">VERIFIED</h3>
              <p className="text-gray-500 text-[12px] font-black uppercase tracking-[0.5em] mb-12 tracking-widest">Stage 03: Verification Success</p>
              
              <div className="bg-indigo-600/10 border-2 border-indigo-500/20 rounded-[2.5rem] p-10 mb-12 flex flex-col md:flex-row items-center gap-8 text-left max-w-xl mx-auto shadow-2xl relative overflow-hidden group">
                <div className="bg-indigo-600 p-6 rounded-[2rem] shadow-xl shadow-indigo-600/40 z-10">
                  <Ticket className="w-12 h-12 text-white" />
                </div>
                <div className="z-10">
                  <p className="text-white font-black text-3xl italic uppercase tracking-tighter leading-none mb-3 underline decoration-indigo-500 underline-offset-4">GO CHECK SERVER TICKET</p>
                  <p className="text-sm text-gray-400 leading-relaxed font-semibold">
                    Your identity is now validated. Please <span className="text-white">return to Discord</span>. Our system is currently mapping your permissions.
                  </p>
                </div>
              </div>

              <a 
                href={APP_CONFIG.DISCORD_INVITE}
                className="inline-flex items-center space-x-5 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black py-6 px-20 rounded-[2rem] transition-all active:scale-95 shadow-2xl shadow-[#5865F2]/40 text-xs uppercase tracking-[0.3em]"
              >
                <span>Return to Discord</span>
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 flex items-center justify-center space-x-10 text-gray-600 opacity-40">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
        <div className="flex items-center space-x-4">
          <Shield className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.6em]">SECURE IDENTITY GATEWAY v2.5</span>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
      </div>
    </div>
  );
};

export default SessionPage;
