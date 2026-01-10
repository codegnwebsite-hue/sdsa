
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
          { name: "Verification Status", value: "COMPLETED", inline: false }
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "VerifyHub Pro | Secure Gateway" }
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
    const step = parseInt(searchParams.get('step') || '0');

    if (!activeSlug || isNaN(step)) {
      setError("Session link broken. Use the link provided by our Discord bot.");
      return;
    }

    const sessionKey = `session_${activeSlug}`;
    const stored = localStorage.getItem(sessionKey);

    if (!stored) {
      setError("Session expired. Please request a new link.");
      return;
    }

    const session = JSON.parse(stored);
    const now = Date.now();
    const timeSinceClick = now - (session.lastClickTime || 0);
    const isValidStep = session.lastStep === step;
    const isRecent = timeSinceClick < APP_CONFIG.VERIFY_WINDOW_MS;

    if (isValidStep && isRecent) {
      const updated = {
        ...session,
        [`cp${step}`]: true,
        lastClickTime: undefined,
        lastStep: undefined
      };
      
      localStorage.setItem(sessionKey, JSON.stringify(updated));

      // If both steps are now complete, fire the webhook!
      if (updated.cp1 && updated.cp2) {
        sendWebhook(updated.uid || "Unknown", activeSlug);
      }

      setTimeout(() => {
        navigate(`/v/${activeSlug}`);
      }, 1000);
    } else {
      setError(!isRecent ? "Window expired. Click the start button again." : "Invalid sequence.");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center">
      {!error ? (
        <div className="space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full"></div>
            <Loader2 className="w-20 h-20 animate-spin text-white mx-auto relative z-10" />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">Encrypting Step Data...</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto font-medium">Synchronizing with secure verification layer. Keep this window open.</p>
        </div>
      ) : (
        <div className="glass p-12 rounded-[3rem] max-w-md w-full border-red-500/20 shadow-2xl">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 italic uppercase tracking-tight">Checkpoint Failed</h2>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed font-medium">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-3 w-full bg-white text-black font-black py-5 rounded-2xl transition-all shadow-xl hover:bg-indigo-50 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="uppercase tracking-tighter">Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyHandler;
