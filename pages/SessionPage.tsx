
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Lock, Shield, Loader2, Ticket, AlertCircle, Home, Clock, ChevronRight, User, Terminal } from 'lucide-react';
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
    
    // Auth from Slug
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
        console.error("Token error", e);
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
      const remaining = APP_CONFIG.VERIFY_WINDOW_MS - (Date.now() - session.createdAt);
      if (remaining <= 0) { setIsExpired(true); setTimeLeft(0); }
      else { setTimeLeft(remaining); }
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

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  if (!session || isExpired) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="glass p-10 rounded-3xl border-red-500/20 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6 opacity-40" />
          <h2 className="text-lg font-bold uppercase tracking-tight mb-2">{isExpired ? "Session Expired" : "Error"}</h2>
          <p className="text-gray-500 text-xs mb-8">Verification sessions expire after 30 minutes. Request a new link from Discord.</p>
          <Link to="/" className="inline-flex items-center space-x-2 bg-white text-black font-bold py-3 px-6 rounded-xl text-[10px] uppercase tracking-widest">
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const isComplete = session.cp1 && session.cp2;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="glass rounded-2xl overflow-hidden shadow-2xl border-white/5 relative">
        {/* Horizontal Rectangle Header */}
        <div className="p-5 bg-white/[0.02] border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">User ID</span>
              <span className="text-xs font-mono font-bold text-white">{session.uid}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Service</span>
              <span className="text-xs font-bold text-indigo-400">{session.service}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Session Key</span>
              <span className="text-[10px] font-mono text-gray-500">{slug?.slice(0, 10)}...</span>
            </div>
          </div>
          <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/5 flex items-center space-x-2">
            <Clock className={`w-3.5 h-3.5 ${timeLeft < 300000 ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`} />
            <span className={`text-xs font-mono font-bold ${timeLeft < 300000 ? 'text-red-500' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Rectangle Body - Short and Wide */}
        <div className="p-8 flex flex-col items-center justify-center min-h-[220px]">
          {!session.cp1 ? (
            <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Step 01</div>
                  <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight italic">Initial Checkpoint</h3>
                  <p className="text-gray-500 text-[11px] leading-relaxed max-w-sm">Validate your session integrity via our primary secure gateway.</p>
                </div>
                <button 
                  onClick={() => handleCheckpoint(1)}
                  className="flex-shrink-0 flex items-center space-x-3 bg-white text-black font-bold py-4 px-10 rounded-xl transition-all shadow-xl hover:bg-gray-200 active:scale-95"
                >
                  <span className="text-xs uppercase tracking-widest">Begin Step 1</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : !session.cp2 ? (
            <div className="w-full animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="flex items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-3">Step 02</div>
                  <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight italic">Final Authorization</h3>
                  <p className="text-gray-500 text-[11px] leading-relaxed max-w-sm">Confirm your hardware metadata to finalize the Discord role sync.</p>
                </div>
                <button 
                  onClick={() => handleCheckpoint(2)}
                  className="flex-shrink-0 flex items-center space-x-3 bg-white text-black font-bold py-4 px-10 rounded-xl transition-all shadow-xl hover:bg-gray-200 active:scale-95"
                >
                  <span className="text-xs uppercase tracking-widest">Sync Step 2</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full animate-in zoom-in-95 duration-500 text-center">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white uppercase italic tracking-tight leading-none">Verified Successfully</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Identity Synced: {session.uid}</p>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center space-x-4 mb-6 max-w-lg mx-auto">
                <Ticket className="w-6 h-6 text-indigo-400" />
                <p className="text-[11px] text-gray-400 text-left leading-relaxed">
                  Sequence complete. Please <span className="text-white font-bold">Return to your Discord Ticket</span> now. Our systems are processing your roles.
                </p>
              </div>

              <a 
                href={APP_CONFIG.DISCORD_INVITE}
                className="inline-flex items-center space-x-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3.5 px-10 rounded-xl transition-all active:scale-95 shadow-lg shadow-[#5865F2]/20 text-xs uppercase tracking-widest"
              >
                <span>Return to Discord</span>
              </a>
            </div>
          )}
        </div>
        
        {/* Thin Footer */}
        <div className="bg-black/30 py-3 flex items-center justify-center space-x-2 text-gray-600 border-t border-white/5">
          <Shield className="w-3 h-3" />
          <span className="text-[8px] font-bold uppercase tracking-[0.4em]">AES-256 SECURED SESSION</span>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;
