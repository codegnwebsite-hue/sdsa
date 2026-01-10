
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { APP_CONFIG } from '../constants';

const VerifyHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const sendWebhook = async (uid: string, slug: string) => {
    if (!APP_CONFIG.DISCORD_WEBHOOK_URL || APP_CONFIG.DISCORD_WEBHOOK_URL.includes("YOUR_WEBHOOK")) return;

    const payload = {
      embeds: [{
        title: "✅ User Verified Successfully",
        color: 3066993, // Green
        fields: [
          { name: "User ID", value: `<@${uid}> (${uid})`, inline: true },
          { name: "Session Token", value: `\`${slug}\``, inline: true },
          { name: "Status", value: "AUTHENTICATED", inline: false }
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "VerifyHub Pro Gateway" }
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
      setError("Session link broken. Please return to Discord.");
      return;
    }

    const sessionKey = `session_${activeSlug}`;
    const stored = localStorage.getItem(sessionKey);

    if (!stored) {
      setError("Session context lost. Please return to the verification page.");
      return;
    }

    const session = JSON.parse(stored);
    const now = Date.now();
    
    // Validate session age against original creation time
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
      }, 800);
    } else {
      if (!isSessionValid) {
        setError("Your session expired (30 minute limit reached).");
      } else {
        setError(!isRecent ? "Security window expired. Please try the step again." : "Invalid sequence detected.");
      }
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 text-center">
      {!error ? (
        <div className="space-y-6">
          <Loader2 className="w-12 h-12 animate-spin text-white opacity-40 mx-auto" />
          <h2 className="text-xl font-bold uppercase tracking-tight">Syncing Step {searchParams.get('step')}</h2>
          <p className="text-gray-500 text-xs max-w-xs mx-auto">Connecting to secure gateway. Please wait...</p>
        </div>
      ) : (
        <div className="glass p-10 rounded-[2rem] max-w-sm w-full border-red-500/20 shadow-2xl">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-6" />
          <h2 className="text-lg font-bold mb-2 uppercase">Sync Failed</h2>
          <p className="text-gray-500 text-xs mb-8 leading-relaxed">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-2 w-full bg-white text-black font-bold py-4 rounded-xl transition-all hover:bg-gray-200 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest">Go Back</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyHandler;
