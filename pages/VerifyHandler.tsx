
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import { APP_CONFIG } from '../constants';

const VerifyHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const sendWebhook = async (uid: string, slug: string) => {
    if (!APP_CONFIG.DISCORD_WEBHOOK_URL || APP_CONFIG.DISCORD_WEBHOOK_URL.includes("YOUR_WEBHOOK")) return;

    const payload = {
      embeds: [{
        title: "✅ Identity Validated",
        color: 3066993,
        fields: [
          { name: "Entity UID", value: `<@${uid}>`, inline: true },
          { name: "Session Key", value: `\`${slug}\``, inline: true },
          { name: "Status", value: "SUCCESSFUL HANDSHAKE", inline: false }
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "VerifyHub Pro Secure Gateway" }
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
    const searchParams = new URLSearchParams(location.search);
    const slugFromUrl = searchParams.get('slug');
    const stepStr = searchParams.get('step');
    const step = stepStr ? parseInt(stepStr) : 0;
    
    const activeSlug = slugFromUrl || localStorage.getItem('active_session_slug');

    if (!activeSlug || isNaN(step) || step === 0) {
      setError("Security token or step ID missing from sequence.");
      return;
    }

    const sessionKey = `session_${activeSlug}`;
    const stored = localStorage.getItem(sessionKey);

    if (!stored) {
      setError("Session context not found. Ensure you are using the same browser.");
      return;
    }

    const session = JSON.parse(stored);
    const now = Date.now();
    
    // 1. Session Expiry Check (30 min window)
    const sessionAge = now - (session.createdAt || 0);
    const isSessionValid = sessionAge < APP_CONFIG.VERIFY_WINDOW_MS;

    if (!isSessionValid) {
      setError("Session buffer expired. Please generate a new link in Discord.");
      return;
    }

    // 2. Sequential Validation (ENFORCEMENT)
    // Step 2 cannot be accessed unless Step 1 (cp1) is already true
    if (step === 2 && !session.cp1) {
      setError("Sequential violation: Complete Stage 1 (Linkvertise) first. Do not bypass.");
      return;
    }

    // 3. Handshake & Bypass Validation
    // We check if the user actually initiated this specific step from the website.
    const isCorrectStep = session.lastStep === step;
    
    // Verify the redirect happened recently (within 15 minutes)
    const clickAge = now - (session.lastClickTime || 0);
    const isValidHandshake = session.lastClickTime && clickAge < (15 * 60 * 1000);

    // If they try to access the verify endpoint without having clicked the button recently
    if (!isValidHandshake || !isCorrectStep) {
      setError("Unauthorized access attempt detected. Do not bypass the verification links.");
      return;
    }

    // 4. Source Validation (Referrer Check)
    const referrer = document.referrer.toLowerCase();
    const isLinkvertise = referrer.includes('link-hub.net') || referrer.includes('linkvertise.com');
    const isPocoLinks = referrer.includes('pocolinks.com');

    // Soft warning/check for bypassers (Note: Some browsers/VPNs strip referrer)
    // We enforce strictly if the session state suggests a skip
    if (step === 1 && !isLinkvertise && referrer !== "" && !referrer.includes(window.location.hostname)) {
       console.warn("Suspicious source detected for Step 1");
    }
    
    // If all checks pass, proceed with updating state
    const updated = {
      ...session,
      [`cp${step}`]: true,
      // Reset handshake tokens to prevent replay or direct URL reuse
      lastClickTime: undefined,
      lastStep: undefined 
    };
    
    localStorage.setItem(sessionKey, JSON.stringify(updated));

    // If both checkpoints are cleared, notify Discord
    if (updated.cp1 && updated.cp2) {
      sendWebhook(updated.uid || "Unknown", activeSlug);
    }

    // Return user back to the Identity Card
    const timer = setTimeout(() => {
      navigate(`/v/${activeSlug}`);
    }, 1200);

    return () => clearTimeout(timer);
  }, [location, navigate]);

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
              <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white mb-2">Syncing Sequence</h2>
              <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.4em]">Validating handshake with primary gateway...</p>
            </div>
            <div className="w-64 h-1.5 bg-white/5 rounded-full mx-auto overflow-hidden">
               <div className="h-full bg-indigo-600 animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 py-8 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white mb-2">Access Denied</h2>
              <p className="text-red-500/70 text-sm font-bold tracking-tight px-10 leading-relaxed uppercase tracking-widest">{error}</p>
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
