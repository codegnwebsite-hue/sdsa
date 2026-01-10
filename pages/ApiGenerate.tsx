
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { APP_CONFIG } from '../constants';
import { Terminal, Code, Copy, Check, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';

const ApiGenerate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchApi = async () => {
      const uid = searchParams.get('uid');
      const providedKey = searchParams.get('key');
      
      if (!uid || !providedKey) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/generate?uid=${uid}&key=${providedKey}&service=${searchParams.get('service') || 'Verification'}&name=${searchParams.get('name') || ''}&avatar=${searchParams.get('avatar') || ''}`);
        const data = await res.json();
        setResponse(data);
      } catch (e) {
        setResponse({ status: "error", message: "Network error: Serverless function unreachable." });
      } finally {
        setLoading(false);
      }
    };

    fetchApi();
  }, [searchParams]);

  const botEndpoint = `https://${window.location.host}/api/generate`;

  const botCodeJS = `// Discord.js Bot Integration
const axios = require('axios');

async function getVerifyLink(user) {
    try {
        const res = await axios.get('${botEndpoint}', {
            params: {
                uid: user.id,
                name: user.username,
                avatar: user.displayAvatarURL({ extension: 'png' }),
                key: '${APP_CONFIG.API_SECRET}', 
                service: 'Server Access'
            }
        });
        return res.data.data.verification_url;
    } catch (err) {
        console.error('API Error:', err.response?.data || err.message);
        return null;
    }
}`;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-600/20">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Bot Developer Hub</h1>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-1">Status: Operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-widest mb-0.5">Your API Key</span>
                <span className="text-xs font-mono text-indigo-400">{APP_CONFIG.API_SECRET}</span>
             </div>
          </div>
        </div>

        {/* Configuration Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-500/5 border border-green-500/10 p-5 rounded-2xl flex items-center space-x-4">
            <div className="bg-green-500/20 p-2 rounded-lg text-green-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-sm">
              <p className="font-bold text-green-400">Vercel Variables Set</p>
              <p className="text-green-500/60 text-xs">VITE_API_SECRET is detected.</p>
            </div>
          </div>
          <div className="bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-2xl flex items-center space-x-4">
            <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div className="text-sm">
              <p className="font-bold text-indigo-400">Personalization Active</p>
              <p className="text-indigo-400/60 text-xs">Name and Avatar are now supported.</p>
            </div>
          </div>
        </div>

        {/* JSON Response */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
              <Code className="w-4 h-4" />
              <span>API Response Preview</span>
            </div>
            {loading && <div className="text-[10px] text-indigo-400 font-bold uppercase animate-pulse">Requesting Server...</div>}
          </div>
          <pre className="bg-[#0a0a0b] border border-white/5 p-8 rounded-3xl overflow-x-auto text-indigo-400 font-mono text-sm shadow-2xl min-h-[160px]">
            {response ? JSON.stringify(response, null, 4) : `// TEST YOUR CONNECTION:
// Open this link in a new tab to see if your Vercel API is working:
// ${botEndpoint}?uid=12345&key=${APP_CONFIG.API_SECRET}&name=TestUser`}
          </pre>
          {!response && (
             <div className="flex items-center space-x-2 text-yellow-500/60 text-[10px] font-bold uppercase tracking-widest px-2">
                <AlertTriangle className="w-3 h-3" />
                <span>The response above will appear once you hit the endpoint with valid parameters.</span>
             </div>
          )}
        </div>

        {/* Integration Code */}
        <div className="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold italic uppercase tracking-tight">Node.js Integration</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Requires Axios</p>
            </div>
            <button 
              onClick={() => { navigator.clipboard.writeText(botCodeJS); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all active:scale-95"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-400" />}
            </button>
          </div>
          
          <pre className="bg-black/60 p-6 rounded-2xl text-[11px] font-mono text-gray-300 overflow-x-auto border border-white/5 leading-relaxed">
            {botCodeJS}
          </pre>
        </div>

        <div className="text-center pb-10">
           <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.4em]">VerifyPro Developer Interface &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default ApiGenerate;
