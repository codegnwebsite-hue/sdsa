
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import { APP_CONFIG } from '../constants';

const VerifyHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const sendWebhook = async (uid: string, slug: string) => {
    if (!APP_CONFIG.DISCORD_WEBHOOK_URL || APP_CONFIG.DISCORD_WEBHOOK_URL.includes("YOUR_WEBHOOK")) return;

    const payload = {
      embeds: [{
        title: "✅ Identity Card Validated",
        color: 3066993, // Green
        fields: [
          { name: "Entity UID", value: `<@${uid}>`, inline: true },
          { name: "Key ID", value: `\`${slug}\``, inline: true },
          { name: "Step Status", value: "SUCCESSFUL SYNC", inline: false }
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "VerifyPro Gateway Protocol" }
      }]
    };

    try {
      await fetch(APP_CONFIG.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("Webhook failed", e);
    }
  };

  useEffect(() => {
    const slugFromUrl = searchParams.get('slug');
    const activeSlug = slugFromUrl || localStorage.getItem('active_session_slug');
    const stepStr = searchParams.get('step');
    const step = stepStr ? parseInt(stepStr) : 0;

    if (!activeSlug || isNaN(step)) {
      setError("Security token mismatch. Access denied.");
      return;
    }

    const sessionKey = `session_${activeSlug}`;
    const stored = localStorage.getItem(sessionKey);

    if (!stored) {
      setError("Context integrity check failed. Please restart session.");
      return;
    }

    const session = JSON.parse(stored);
    const now = Date.now();
    
    const sessionAge = now - (session.createdAt || 0);
    const isSessionValid = sessionAge < APP_CONFIG.VERIFY_WINDOW_MS;
    
    const timeSinceClick = now - (session.lastClickTime || 0);
    const isValidStep = session.lastStep === step;
    const isRecent = timeSinceClick < APP_CONFIG.VERIFY_WINDOW_MS;

    if (isSessionValid && isValidStep && isRecent) {
      const updated = {
        ...session,
        [`cp${step}`]: true,
        lastClickTime: undefined,
        lastStep: undefined
      };
      
      localStorage.setItem(sessionKey, JSON.stringify(updated));

      if (updated.cp1 && updated.cp2) {
        sendWebhook(updated.uid || "Unknown", activeSlug);
      }

      setTimeout(() => {
        navigate(`/v/${activeSlug}`);
      }, 1500); // Slightly longer for "tech" feel
    } else {
      if (!isSessionValid) {
        setError("Identity buffer expired (30m limit).");
      } else {
        setError(!isRecent ? "Security timeout. Re-verify step." : "Sequence out of order.");
      }
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-6">
      <div className="glass max-w-2xl w-full rounded-[2.5rem] p-12 text-center shadow-2xl border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse"></div>
        
        {!error ? (
          <div className="space-y-8 py-8">
            <div className="relative inline-block">
               <Loader2 className="w-20 h-20 animate-spin text-indigo-500 opacity-20 mx-auto" />
               <Shield className="w-8 h-8 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white mb-2">Syncing Sequence 0{searchParams.get('step')}</h2>
              <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.4em]">Establishing secure identity handshake...</p>
            </div>
            <div className="w-64 h-1.5 bg-white/5 rounded-full mx-auto overflow-hidden">
               <div className="h-full bg-indigo-600 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 py-8 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white mb-2">Protocol Violation</h2>
              <p className="text-red-500/70 text-sm font-bold tracking-tight px-10 leading-relaxed">{error}</p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="group flex items-center justify-center space-x-3 w-full max-w-xs mx-auto bg-white text-black font-black py-5 rounded-2xl transition-all hover:bg-gray-200 active:scale-95 shadow-xl"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs uppercase tracking-[0.2em]">Reset Session</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default VerifyHandler;
