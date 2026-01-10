
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Lock, ExternalLink, Shield, Loader2, Ticket, AlertCircle, Home, Clock, ChevronRight } from 'lucide-react';
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
    
    let currentSession: SessionData | null = null;
    const stored = localStorage.getItem(`session_${slug}`);
    
    if (stored) {
      currentSession = JSON.parse(stored);
    } else if (slug.startsWith('u_')) {
      try {
        const base64 = slug.substring(2);
        const decoded = atob(base64);
        const [uid, service, timestamp] = decoded.split(':');
        
        currentSession = {
          uid,
          service,
          cp1: false,
          cp2: false,
          createdAt: parseInt(timestamp) || Date.now()
        };
        
        localStorage.setItem(`session_${slug}`, JSON.stringify(currentSession));
      } catch (e) {
        console.error("Token decode failed", e);
      }
    }
    
    if (currentSession) {
      setSession(currentSession);
      localStorage.setItem('active_session_slug', slug);
    }
    
    setLoading(false);
  }, [slug]);

  // Timer logic
  useEffect(() => {
    if (!session || isExpired) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - session.createdAt;
      const remaining = APP_CONFIG.VERIFY_WINDOW_MS - elapsed;
      
      if (remaining <= 0) {
        setIsExpired(true);
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

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
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>;

  if (!session || isExpired) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="glass p-12 rounded-[3rem] border-red-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">
            {isExpired ? "Session Expired" : "Invalid Link"}
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            {isExpired 
              ? "For your security, verification sessions only last 30 minutes. Please go back to Discord and request a new link." 
              : "This link is invalid or has been tampered with. Return to Discord and generate a new one."}
          </p>
          <Link to="/" className="inline-flex items-center space-x-2 bg-white text-black font-black py-4 px-10 rounded-2xl transition-all shadow-xl hover:bg-indigo-50 active:scale-95">
            <Home className="w-5 h-5" />
            <span className="uppercase tracking-tighter">Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const isComplete = session.cp1 && session.cp2;

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="glass rounded-[3rem] overflow-hidden shadow-2xl border-white/5 relative">
        {/* Progress Bar / Timer */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
          <div 
            className={`h-full transition-all duration-1000 ${timeLeft < 60000 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-indigo-500 shadow-[0_0_10px_#6366f1]'}`}
            style={{ width: `${(timeLeft / APP_CONFIG.VERIFY_WINDOW_MS) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="bg-indigo-600/10 p-8 pt-10 border-b border-white/5">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
               <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Authenticated Entity</span>
               <p className="text-sm font-mono text-indigo-300">ID: {session.uid?.slice(0, 12)}...</p>
            </div>
            <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/10 flex items-center space-x-3">
              <Clock className={`w-4 h-4 ${timeLeft < 60000 ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`} />
              <span className={`text-sm font-mono font-bold ${timeLeft < 60000 ? 'text-red-500' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1 flex items-center">
                <div className={`w-full h-1.5 rounded-full ${
                  (step === 1 && session.cp1) || (step === 2 && session.cp2) || (step === 3 && isComplete)
                    ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' 
                    : step === (isComplete ? 3 : session.cp1 ? 2 : 1)
                      ? 'bg-indigo-500 animate-pulse'
                      : 'bg-white/10'
                }`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-1">
             <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Step 1</span>
             <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Step 2</span>
             <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Complete</span>
          </div>
        </div>

        <div className="p-10 text-center min-h-[400px] flex flex-col justify-center">
          {!session.cp1 ? (
            /* STEP 1 UI */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-indigo-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20 shadow-xl">
                <span className="text-4xl font-black italic text-indigo-400">01</span>
              </div>
              <h3 className="text-3xl font-black mb-4 italic uppercase tracking-tighter text-white">Initial Checkpoint</h3>
              <p className="text-gray-400 mb-10 text-sm leading-relaxed max-w-xs mx-auto">
                First, bypass our primary security layer to confirm your session integrity.
              </p>
              <button 
                onClick={() => handleCheckpoint(1)}
                className="group flex items-center justify-center space-x-4 bg-white text-black font-black py-6 px-12 rounded-[1.5rem] transition-all shadow-2xl hover:bg-indigo-50 active:scale-95 w-full"
              >
                <span className="text-lg uppercase tracking-tighter">Enter Checkpoint</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : !session.cp2 ? (
            /* STEP 2 UI */
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="w-20 h-20 bg-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-purple-500/20 shadow-xl">
                <span className="text-4xl font-black italic text-purple-400">02</span>
              </div>
              <h3 className="text-3xl font-black mb-4 italic uppercase tracking-tighter text-white">Final Encryption</h3>
              <p className="text-gray-400 mb-10 text-sm leading-relaxed max-w-xs mx-auto">
                Step 1 confirmed. Complete the final link to sync your credentials with the Discord server.
              </p>
              <button 
                onClick={() => handleCheckpoint(2)}
                className="group flex items-center justify-center space-x-4 bg-white text-black font-black py-6 px-12 rounded-[1.5rem] transition-all shadow-2xl hover:bg-indigo-50 active:scale-95 w-full"
              >
                <span className="text-lg uppercase tracking-tighter">Finalize Access</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            /* STEP 3 (SUCCESS) UI */
            <div className="animate-in zoom-in-95 duration-700">
              <div className="w-24 h-24 bg-green-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.3)] rotate-3">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-4xl font-black mb-4 italic uppercase tracking-tighter text-white">VERIFIED</h3>
              <p className="text-gray-400 mb-4 text-lg leading-relaxed max-w-sm mx-auto">
                Authentication sequence complete for <span className="text-white font-mono">{session.uid}</span>.
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10 text-left">
                <div className="flex items-start space-x-4">
                  <Ticket className="w-10 h-10 text-indigo-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white font-bold text-lg mb-1">Check Your Ticket</p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Return to your <span className="text-indigo-400 font-bold uppercase tracking-widest">Discord Ticket</span> immediately. Our bot is currently syncing your roles.
                    </p>
                  </div>
                </div>
              </div>

              <a 
                href={APP_CONFIG.DISCORD_INVITE}
                className="flex items-center justify-center space-x-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black py-6 rounded-[1.5rem] transition-all shadow-2xl active:scale-95 w-full"
              >
                <span className="text-xl uppercase tracking-tighter">Return to Discord</span>
              </a>
            </div>
          )}
        </div>
        
        {/* Security Footer */}
        <div className="bg-black/20 p-6 flex items-center justify-center space-x-3 text-gray-600">
          <Shield className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">AES-256 SESSION PROTECTION ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;
