
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { APP_CONFIG } from '../constants';
import { Terminal, Code, Copy, Check } from 'lucide-react';

const ApiGenerate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [response, setResponse] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const uid = searchParams.get('uid');
    const providedKey = searchParams.get('key')?.trim();
    const service = searchParams.get('service') || 'Verification';

    // Verify the key against our config
    if (!providedKey || providedKey !== APP_CONFIG.API_SECRET) {
      setResponse({ 
        status: "error", 
        code: 401, 
        message: "Unauthorized: Invalid API key.",
        hint: "Ensure your 'key' parameter matches VITE_API_SECRET in Vercel or the default in constants.tsx"
      });
      return;
    }

    if (!uid) {
      setResponse({ status: "error", code: 400, message: "Missing 'uid' parameter." });
      return;
    }

    // Generate a stateless token (Base64 encoded string containing data)
    const dataString = `${uid}:${service}:${Date.now()}`;
    const token = `u_${btoa(dataString).replace(/=/g, '')}`;
    
    const protocol = window.location.protocol;
    const host = window.location.host;
    // Using /#/ for HashRouter compatibility
    const cleanUrl = `${protocol}//${host}/#/v/${token}`;

    setResponse({
      status: "success",
      data: {
        uid,
        token,
        verification_url: cleanUrl
      }
    });
  }, [searchParams]);

  const botCodeJS = `// Discord.js Example
const axios = require('axios');
const response = await axios.get('https://${window.location.host}/#/api/generate', {
    params: {
        uid: interaction.user.id,
        key: '${APP_CONFIG.API_SECRET}',
        service: 'Member Role'
    }
});
const link = response.data.data.verification_url;
interaction.reply({ content: \`Verify here: \${link}\`, ephemeral: true });`;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Terminal className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">API Developer Console</h1>
          </div>
          <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-widest">
            System Online
          </div>
        </div>

        {/* JSON Response */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
            <Code className="w-4 h-4" />
            <span>Endpoint Response</span>
          </div>
          <pre className="bg-black border border-white/5 p-6 rounded-2xl overflow-x-auto text-indigo-400 font-mono text-sm shadow-2xl">
            {response ? JSON.stringify(response, null, 4) : "// Waiting for request..."}
          </pre>
        </div>

        {/* Integration Guide */}
        <div className="grid md:grid-cols-1 gap-6">
          <div className="glass p-8 rounded-[2rem] border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold italic uppercase tracking-tight">Bot Integration (Discord.js)</h3>
              <button 
                onClick={() => { navigator.clipboard.writeText(botCodeJS); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            <pre className="bg-black/40 p-4 rounded-xl text-xs font-mono text-gray-300 overflow-x-auto border border-white/5">
              {botCodeJS}
            </pre>
            <div className="mt-6 p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-xs text-indigo-300">
              <strong>Tip:</strong> Host your bot on a VPS or Replit and use <code>axios</code> to call this URL. Use the <code>API_SECRET</code> from your constants file.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiGenerate;
