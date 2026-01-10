
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
    
    // 1. Extract session metadata from SLUG FIRST (Always authoritative for time)
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
        console.error("Token decode failed", e);
      }
    }

    if (!metaData) {
      setLoading(false);
      return;
    }

    // 2. Check LocalStorage for PROGRESS only
    const stored = localStorage.getItem(`session_${slug}`);
    let currentSession: SessionData;

    if (stored) {
      const storedData = JSON.parse(stored);
      currentSession = {
        ...storedData,
        // Override with metadata from slug to prevent timer resets
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

  // Timer logic - Persistent based on session.createdAt
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
    
    const updated = { ...session, lastClickTime: Date.now(), lastStep: step };
    localStorage.setItem(`session_${slug}`, JSON.stringify(updated));
    setSession(updated);

    const link = step === 1 ? APP_CONFIG.CHECKPOINT_1_LINK : APP_CONFIG.CHECKPOINT_2_LINK;
    window.location.href = link;
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  if (!session || isExpired) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="glass p-10 rounded-[2rem] border-red-500/20 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
          <h2 className="text-xl font-bold uppercase tracking-tight mb-3">
            {isExpired ? "Session Expired" : "Identity Error"}
          </h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            {isExpired 
              ? "Verification sessions expire after 30 minutes. Please return to Discord to generate a new link." 
              : "We could not validate your session. Ensure you are using the official link from our bot."}
          </p>
          <Link to="/" className="inline-flex items-center space-x-2 bg-white text-black font-bold py-3 px-8 rounded-xl transition-all hover:bg-gray-200 active:scale-95">
            <Home className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest">Return Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const isComplete = session.cp1 && session.cp2;

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <div className="glass rounded-[2rem] overflow-hidden shadow-2xl border-white/5 relative">
        {/* Compact Persistent Timer Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <div 
            className={`h-full transition-all duration-1000 ${timeLeft < 300000 ? 'bg-red-500' : 'bg-indigo-500'}`}
            style={{ width: `${(timeLeft / APP_CONFIG.VERIFY_WINDOW_MS) * 100}%` }}
          />
        </div>

        {/* Identity Header */}
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              <Clock className={`w-3 h-3 ${timeLeft < 300000 ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`} />
              <span className={`text-[10px] font-mono font-bold ${timeLeft < 300000 ? 'text-red-500' : 'text-indigo-400'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Security Protocol
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-gray-500">
                <User className="w-3.5 h-3.5" />
                <span>USER ID</span>
              </div>
              <span className="font-mono text-white font-semibold">{session.uid}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-gray-500">
                <Shield className="w-3.5 h-3.5" />
                <span>SERVICE</span>
              </div>
              <span className="text-white font-semibold">{session.service}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-gray-500">
                <Terminal className="w-3.5 h-3.5" />
                <span>TOKEN</span>
              </div>
              <span className="font-mono text-indigo-400 text-[10px] opacity-70">
                {slug?.slice(0, 8)}...{slug?.slice(-8)}
              </span>
            </div>
          </div>
        </div>

        {/* Sequential Steps Body */}
        <div className="p-8 text-center min-h-[340px] flex flex-col justify-center">
          {!session.cp1 ? (
            /* STEP 1 */
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                <span className="text-lg font-bold text-indigo-400">01</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">First Checkpoint</h3>
              <p className="text-gray-500 text-xs mb-8 leading-relaxed px-4">
                Validate your initial session integrity to proceed to the next layer.
              </p>
              <button 
                onClick={() => handleCheckpoint(1)}
                className="group flex items-center justify-center space-x-3 bg-white text-black font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:bg-gray-200 active:scale-95 w-full"
              >
                <span className="text-xs uppercase tracking-widest">Begin Step 1</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : !session.cp2 ? (
            /* STEP 2 */
            <div className="animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
                <span className="text-lg font-bold text-purple-400">02</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Final Sync</h3>
              <p className="text-gray-500 text-xs mb-8 leading-relaxed px-4">
                Step 1 verified. Complete this final step to synchronize your Discord roles.
              </p>
              <button 
                onClick={() => handleCheckpoint(2)}
                className="group flex items-center justify-center space-x-3 bg-white text-black font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:bg-gray-200 active:scale-95 w-full"
              >
                <span className="text-xs uppercase tracking-widest">Complete Step 2</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            /* STEP 3 (SUCCESS) */
            <div className="animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">SUCCESS</h3>
              <p className="text-gray-500 text-xs mb-8 px-4">
                Verification data for <span className="text-white font-mono">{session.uid}</span> has been processed.
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 text-left">
                <div className="flex items-start space-x-3">
                  <Ticket className="w-8 h-8 text-indigo-400 flex-shrink-0" />
                  <div>
                    <p className="text-white font-bold text-sm">Check Your Ticket</p>
                    <p className="text-[11px] text-gray-500 leading-normal mt-1">
                      Your identity is confirmed. Please return to your <span className="text-white">Discord Support Ticket</span> now.
                    </p>
                  </div>
                </div>
              </div>

              <a 
                href={APP_CONFIG.DISCORD_INVITE}
                className="flex items-center justify-center space-x-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 rounded-xl transition-all active:scale-95 w-full shadow-lg shadow-[#5865F2]/20"
              >
                <span className="text-xs uppercase tracking-widest">Open Discord</span>
              </a>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-black/20 py-4 flex items-center justify-center space-x-2 text-gray-600 border-t border-white/5">
          <Shield className="w-3.5 h-3.5" />
          <span className="text-[9px] font-bold uppercase tracking-[0.3em]">SECURE IDENTITY SESSION</span>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;
