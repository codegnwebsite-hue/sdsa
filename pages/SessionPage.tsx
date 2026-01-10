
import React, { useState, useEffect } from 'react';
// Fix: Remove useNavigate as it was unused and causing errors; ensure useParams/Link compatibility
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Lock, ExternalLink, Shield, Loader2, Ticket, AlertCircle, Home } from 'lucide-react';
import { APP_CONFIG } from '../constants';

interface SessionData {
  cp1: boolean;
  cp2: boolean;
  lastClickTime?: number;
  lastStep?: number;
  uid?: string;
  service?: string;
  createdAt?: number;
}

const SessionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    // Check local storage first
    const stored = localStorage.getItem(`session_${slug}`);
    if (stored) {
      setSession(JSON.parse(stored));
    } else if (slug.startsWith('u_')) {
      // Decode stateless token
      try {
        const base64 = slug.substring(2);
        const decoded = atob(base64);
        const [uid, service, timestamp] = decoded.split(':');
        
        const newSession: SessionData = {
          uid,
          service,
          cp1: false,
          cp2: false,
          createdAt: parseInt(timestamp) || Date.now()
        };
        
        localStorage.setItem(`session_${slug}`, JSON.stringify(newSession));
        setSession(newSession);
      } catch (e) {
        console.error("Token decode failed", e);
      }
    }
    
    localStorage.setItem('active_session_slug', slug);
    setLoading(false);
  }, [slug]);

  const handleCheckpoint = (step: number) => {
    if (!slug || !session) return;
    
    const updated = { ...session, lastClickTime: Date.now(), lastStep: step };
    localStorage.setItem(`session_${slug}`, JSON.stringify(updated));
    setSession(updated);

    const link = step === 1 ? APP_CONFIG.CHECKPOINT_1_LINK : APP_CONFIG.CHECKPOINT_2_LINK;
    window.location.href = link;
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>;

  if (!session) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="glass p-12 rounded-[3rem] border-red-500/20 shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Invalid Link</h2>
          <p className="text-gray-400 mb-8">This link is invalid. Return to Discord and generate a new one.</p>
          <Link to="/" className="inline-flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-8 rounded-2xl transition-all border border-white/10">
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const isComplete = session.cp1 && session.cp2;

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="glass rounded-[3rem] overflow-hidden shadow-2xl border-white/5">
        <div className="bg-indigo-600/10 p-8 border-b border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <span>Session <span className="text-indigo-400 font-mono text-xs opacity-50 ml-2">#{slug.slice(0, 8)}...</span></span>
            </h2>
            <div className="flex space-x-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${session.cp1 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-white/10'}`} />
              <div className={`w-2.5 h-2.5 rounded-full ${session.cp2 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-white/10'}`} />
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex-1 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Authenticated User</p>
                <p className="text-sm font-mono text-indigo-300 truncate">{session.uid || "Unknown Entity"}</p>
             </div>
             <div className="flex-1 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Target Service</p>
                <p className="text-sm font-mono text-indigo-300">{session.service || "General Access"}</p>
             </div>
          </div>
        </div>

        <div className="p-10 text-center">
          {!isComplete ? (
            <div className="space-y-6">
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-2">Gatekeeper Security</h3>
                <p className="text-gray-500 text-sm">Follow both steps to finalize your verification.</p>
              </div>

              {/* Step 1 */}
              <div className={`p-6 rounded-3xl border transition-all duration-500 ${session.cp1 ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/5 hover:border-indigo-500/30'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${session.cp1 ? 'bg-green-500/20 text-green-400 rotate-6 shadow-lg shadow-green-500/10' : 'bg-indigo-500/20 text-indigo-400'}`}>
                      {session.cp1 ? <CheckCircle2 className="w-8 h-8" /> : <span className="font-black text-2xl italic">01</span>}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg">Primary Link</p>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{session.cp1 ? 'Status: Verified' : 'Status: Awaiting'}</p>
                    </div>
                  </div>
                  {!session.cp1 && (
                    <button 
                      onClick={() => handleCheckpoint(1)}
                      className="bg-white text-black px-6 py-4 rounded-2xl text-xs font-black hover:bg-indigo-50 transition-all active:scale-95 flex items-center space-x-2 shadow-xl"
                    >
                      <span>START</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Step 2 */}
              <div className={`p-6 rounded-3xl border transition-all duration-500 ${
                session.cp2 ? 'bg-green-500/5 border-green-500/20' : 
                !session.cp1 ? 'bg-black/40 border-white/5 opacity-40 cursor-not-allowed grayscale' : 
                'bg-white/5 border-white/5 hover:border-indigo-500/30 shadow-xl'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      session.cp2 ? 'bg-green-500/20 text-green-400 rotate-6' : 
                      !session.cp1 ? 'bg-white/5 text-gray-600' : 
                      'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {!session.cp1 ? <Lock className="w-7 h-7" /> : session.cp2 ? <CheckCircle2 className="w-8 h-8" /> : <span className="font-black text-2xl italic">02</span>}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg">Secondary Link</p>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                        {session.cp2 ? 'Status: Verified' : !session.cp1 ? 'Locked' : 'Status: Awaiting'}
                      </p>
                    </div>
                  </div>
                  {session.cp1 && !session.cp2 && (
                    <button 
                      onClick={() => handleCheckpoint(2)}
                      className="bg-white text-black px-6 py-4 rounded-2xl text-xs font-black hover:bg-indigo-50 transition-all active:scale-95 flex items-center space-x-2 shadow-xl"
                    >
                      <span>START</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="w-28 h-28 bg-green-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.3)] rotate-3">
                <CheckCircle2 className="w-14 h-14 text-green-400" />
              </div>
              <h3 className="text-4xl font-black mb-4 italic uppercase tracking-tighter">Access Granted</h3>
              <p className="text-gray-400 mb-12 text-lg leading-relaxed max-w-sm mx-auto">
                Success! Your verification for user <span className="text-white font-mono">{session.uid}</span> is complete.
              </p>
              <a 
                href={APP_CONFIG.DISCORD_INVITE}
                className="flex items-center justify-center space-x-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black py-6 rounded-[1.5rem] transition-all shadow-[0_20px_40px_rgba(88,101,242,0.3)] hover:-translate-y-2 active:scale-95"
              >
                <Ticket className="w-7 h-7" />
                <span className="text-xl uppercase tracking-tighter">Claim Your Role</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionPage;