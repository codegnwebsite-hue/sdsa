
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Shield, Loader2, Ticket, AlertCircle, Home, Clock, ChevronRight, User, Key, RefreshCw } from 'lucide-react';
import { APP_CONFIG } from '../constants';

interface SessionData {
  cp1: boolean;
  cp2: boolean;
  lastClickTime?: number;
  lastStep?: number;
  uid?: string;
  userName?: string;
  userAvatar?: string;
  service?: string;
  plan?: string;
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

  const safeAtob = (str: string) => {
    try {
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      return atob(padded);
    } catch (e) {
      console.error("Base64 decode error", e);
      return null;
    }
  };

  useEffect(() => {
    if (!slug) return;
    
    let metaData: { uid: string, service: string, createdAt: number, userName?: string, plan?: string, userAvatar?: string } | null = null;
    if (slug.startsWith('u_')) {
      const base64Part = slug.substring(2);
      const decoded = safeAtob(base64Part);
      if (decoded) {
        const parts = decoded.split(':');
        if (parts.length >= 3) {
          // Token Format: uid:service:timestamp:name:plan:avatar
          metaData = {
            uid: parts[0],
            service: parts[1],
            createdAt: parseInt(parts[2]) || Date.now(),
            userName: parts[3] || '',
            plan: parts[4] || 'Free',
            userAvatar: parts.slice(5).join(':') || ''
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
        userName: metaData.userName || storedData.userName,
        userAvatar: metaData.userAvatar || storedData.userAvatar,
        service: metaData.service,
        plan: metaData.plan,
        createdAt: metaData.createdAt
      };
    } else {
      currentSession = {
        uid: metaData.uid,
        userName: metaData.userName,
        userAvatar: metaData.userAvatar,
        service: metaData.service,
        plan: metaData.plan,
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
      if (remaining <= 0) { setIsExpired(true); setTimeLeft(0); } else { setTimeLeft(remaining); }
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
    setIsSyncing(true);
    const targetLink = step === 1 ? APP_CONFIG.CHECKPOINT_1_LINK : APP_CONFIG.CHECKPOINT_2_LINK;
    setTimeout(() => { window.location.href = targetLink; }, 800);
  };

  const manualSync = () => {
    if (!slug || !session?.lastStep) return;
    navigate(`/verify?slug=${slug}&step=${session.lastStep}`);
  };

  const formatTime = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const getGlowColor = (plan?: string) => {
    const p = (plan || 'Free').toLowerCase();
    if (p.includes('booster')) return 'bg-pink-500';
    if (p.includes('premium')) return 'bg-cyan-500';
    if (p.includes('basic')) return 'bg-amber-600'; 
    return 'bg-green-500';
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Establishing Secure Tunnel...</span>
    </div>
  );

  if (!session || isExpired) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="glass p-10 rounded-[2rem] border-red-500/20 shadow-2xl text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6 opacity-40" />
          <h2 className="text-xl font-black uppercase mb-4 tracking-tighter italic">Session Invalid</h2>
          <p className="text-gray-500 text-xs mb-8 leading-relaxed">Verification window closed. Please re-open the link from Discord.</p>
          <Link to="/" className="inline-flex items-center space-x-3 bg-white text-black font-black py-3 px-8 rounded-xl text-[10px] uppercase tracking-widest shadow-xl">
            <Home className="w-3.5 h-3.5" />
            <span>Portal Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12 md:py-20 flex items-center justify-center min-h-[70vh]">
      {/* 
          GLOW WRAPPER
          Ensures the glow is strictly panel-scoped and centered behind the content
      */}
      <div className="relative w-full">
        {/* 
            NEON GLOW (REFINED VISIBILITY)
            - Matches panel dimensions (inset-0)
            - Increased opacity for high visibility on dark backgrounds
            - High blur ensures soft diffusion around the edges
            - Layered behind the panel (-z-10)
        */}
        <div className={`absolute inset-0 blur-[120px] rounded-[2.5rem] opacity-60 pointer-events-none -z-10 ${getGlowColor(session.plan)}`}></div>
        
        <div className="glass rounded-[2.5rem] overflow-hidden shadow-2xl border-white/5 relative p-8 w-full z-10">
          
          {/* Compact Header: Avatar + Name + Service Badge */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {session.userAvatar ? (
                  <img 
                    src={session.userAvatar} 
                    alt="" 
                    className="w-10 h-10 rounded-full border border-white/10 object-cover"
                    onError={(e) => { (e.target as any).src = 'https://cdn.discordapp.com/embed/avatars/0.png' }}
                  />
                ) : (
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0b] shadow-[0_0_8px_#22c55e]"></div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-white font-black text-sm uppercase tracking-tight italic">
                    {session.userName || "Unknown User"}
                  </h3>
                  {session.service && session.service !== 'Verification' && (
                    <div className="flex items-center bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                      <span className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">{session.service}</span>
                      <span className="mx-1 text-[8px] text-gray-600">|</span>
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{session.plan || 'Free'}</span>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Verification Pending</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> Time Buffer
              </span>
              <span className={`text-lg font-mono font-black ${timeLeft < 300000 ? 'text-red-500' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-col items-center text-center">
            {isSyncing ? (
              <div className="py-12 space-y-6">
                 <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto" />
                 <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Redirecting...</h3>
              </div>
            ) : !session.cp1 ? (
              /* STEP 1 */
              <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Authorization</h3>
                  <p className="text-gray-400 text-xs font-medium max-w-xs mx-auto">Complete the first handshake to initialize your server profile.</p>
                </div>
                
                <div className="pt-4 space-y-4">
                  <button 
                    onClick={() => handleCheckpoint(1)}
                    className="group flex items-center justify-center space-x-4 bg-white text-black font-black py-5 px-10 rounded-2xl transition-all shadow-xl hover:bg-indigo-50 active:scale-95 w-full"
                  >
                    <span className="text-xs uppercase tracking-[0.2em]">Launch Step 1</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  {session.lastStep === 1 && (
                    <button onClick={manualSync} className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                      <RefreshCw className="w-3 h-3" /> Sync Session Status
                    </button>
                  )}
                </div>
              </div>
            ) : !session.cp2 ? (
              /* STEP 2 */
              <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Final Check</h3>
                  <p className="text-gray-400 text-xs font-medium max-w-xs mx-auto">Authorization active. Finalize the protocol to unlock server access.</p>
                </div>
                
                <div className="pt-4 space-y-4">
                  <button 
                    onClick={() => handleCheckpoint(2)}
                    className="group flex items-center justify-center space-x-4 bg-white text-black font-black py-5 px-10 rounded-2xl transition-all shadow-xl hover:bg-indigo-50 active:scale-95 w-full"
                  >
                    <span className="text-xs uppercase tracking-[0.2em]">Launch Step 2</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  {session.lastStep === 2 && (
                    <button onClick={manualSync} className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                      <RefreshCw className="w-3 h-3" /> Sync Session Status
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* SUCCESS */
              <div className="w-full py-6 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic">Verified</h3>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left flex items-center gap-5">
                  <div className="bg-indigo-600 p-3 rounded-xl shadow-lg">
                    <Ticket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm uppercase italic">Check Discord Tickets</p>
                    <p className="text-[10px] text-gray-400 leading-tight">Identity mapped successfully. Your roles are being assigned.</p>
                  </div>
                </div>

                <a 
                  href={APP_CONFIG.DISCORD_INVITE}
                  className="inline-flex items-center space-x-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black py-4 px-12 rounded-2xl transition-all active:scale-95 shadow-2xl shadow-[#5865F2]/20 text-[10px] uppercase tracking-widest"
                >
                  <span>Return to Discord</span>
                </a>
              </div>
            )}
          </div>

          {/* Tiny footer info */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center space-x-4 text-gray-600">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">SECURE GATEWAY v2.5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;
