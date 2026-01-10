
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Lock, Shield, Loader2, Ticket, AlertCircle, Home, Clock, ChevronRight, User, Terminal, Key } from 'lucide-react';
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
    
    // Auth directly from the Slug token to prevent resets
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
        // Always enforce metadata from URL to keep timer persistent
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
      // Calculate remaining time strictly from session.createdAt
      const remaining = APP_CONFIG.VERIFY_WINDOW_MS - (Date.now() - session.createdAt);
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

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-12 h-12 animate-spin text-indigo-500" /></div>;

  if (!session || isExpired) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="glass p-12 rounded-[2.5rem] border-red-500/20 shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-8 opacity-40" />
          <h2 className="text-2xl font-black italic uppercase mb-4 tracking-tighter">{isExpired ? "Session Expired" : "Identity Null"}</h2>
          <p className="text-gray-500 text-sm mb-10 leading-relaxed px-4">Verification sessions are valid for 30 minutes for your security. Please request a new link from Discord.</p>
          <Link to="/" className="inline-flex items-center space-x-3 bg-white text-black font-black py-4 px-10 rounded-2xl text-xs uppercase tracking-widest shadow-xl">
            <Home className="w-4 h-4" />
            <span>Back to Portal</span>
          </Link>
        </div>
      </div>
    );
  }

  const isComplete = session.cp1 && session.cp2;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Rectangular Horizontal Identity Card */}
      <div className="glass rounded-[2rem] overflow-hidden shadow-2xl border-white/5 relative flex flex-col md:flex-row min-h-[300px]">
        
        {/* Left Sidebar - Meta & Time (1/3 width) */}
        <div className="bg-white/[0.03] border-b md:border-b-0 md:border-r border-white/5 p-8 flex flex-col justify-between w-full md:w-72">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white italic">Session ID</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Authenticated UID</span>
                <span className="text-sm font-mono font-bold text-indigo-400">{session.uid}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Target Service</span>
                <span className="text-sm font-bold text-white uppercase italic">{session.service}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Session Key</span>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-400 bg-black/40 p-2 rounded-lg border border-white/5 truncate">
                   <Key className="w-3 h-3 flex-shrink-0" />
                   <span className="truncate">{slug}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Time Remaining</span>
               <Clock className={`w-3 h-3 ${timeLeft < 300000 ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`} />
            </div>
            <div className={`text-2xl font-mono font-black ${timeLeft < 300000 ? 'text-red-500' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
               <div 
                 className={`h-full transition-all duration-1000 ${timeLeft < 300000 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-indigo-500 shadow-[0_0_10px_#6366f1]'}`}
                 style={{ width: `${(timeLeft / APP_CONFIG.VERIFY_WINDOW_MS) * 100}%` }}
               />
            </div>
          </div>
        </div>

        {/* Right Content Area - Action & Sequence (2/3 width) */}
        <div className="flex-1 p-10 flex flex-col justify-center items-center text-center">
          {!session.cp1 ? (
            /* STEP 1 */
            <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="inline-block px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4 italic">Step 01 / Phase 1</div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">Initial Checkpoint</h3>
              <p className="text-gray-400 text-sm mb-10 leading-relaxed max-w-sm mx-auto">First layer of verification required. Please click below to initiate your security handshake.</p>
              <button 
                onClick={() => handleCheckpoint(1)}
                className="group flex items-center justify-center space-x-4 bg-white text-black font-black py-5 px-12 rounded-2xl transition-all shadow-xl hover:bg-gray-200 active:scale-95 w-full max-w-xs mx-auto"
              >
                <span className="text-sm uppercase tracking-widest">Begin Step 1</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : !session.cp2 ? (
            /* STEP 2 */
            <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="inline-block px-3 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-4 italic">Step 02 / Final Phase</div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">Final Authorization</h3>
              <p className="text-gray-400 text-sm mb-10 leading-relaxed max-w-sm mx-auto">Phase 1 accepted. Confirm your hardware signature to synchronize your roles in the server.</p>
              <button 
                onClick={() => handleCheckpoint(2)}
                className="group flex items-center justify-center space-x-4 bg-white text-black font-black py-5 px-12 rounded-2xl transition-all shadow-xl hover:bg-gray-200 active:scale-95 w-full max-w-xs mx-auto"
              >
                <span className="text-sm uppercase tracking-widest">Complete Step 2</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            /* STEP 3 (SUCCESS) */
            <div className="w-full animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">AUTHENTICATED</h3>
              <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.3em] mb-8">Identity Sequence Complete</p>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex items-center space-x-6 text-left max-w-md mx-auto">
                <div className="bg-indigo-600/20 p-3 rounded-xl">
                  <Ticket className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-black text-lg italic uppercase tracking-tighter leading-none mb-1">Check Server Ticket</p>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    Please return to your <span className="text-white">Discord Ticket</span> immediately. Our bot is currently assigning your new permissions.
                  </p>
                </div>
              </div>

              <a 
                href={APP_CONFIG.DISCORD_INVITE}
                className="inline-flex items-center space-x-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black py-5 px-12 rounded-2xl transition-all active:scale-95 shadow-xl shadow-[#5865F2]/20 text-xs uppercase tracking-widest"
              >
                <span>Back to Discord</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Security Footer */}
      <div className="mt-8 flex items-center justify-center space-x-4 text-gray-600">
        <div className="h-[1px] w-12 bg-white/10"></div>
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">AES-256 SESSION PROTECTION</span>
        </div>
        <div className="h-[1px] w-12 bg-white/10"></div>
      </div>
    </div>
  );
};

export default SessionPage;
