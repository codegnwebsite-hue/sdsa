
import React from 'react';
import { Info as InfoIcon, Zap, ShieldCheck, Users } from 'lucide-react';

const Info: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="glass rounded-[3rem] p-12 border-white/5 space-y-12">
        <div className="flex items-center space-x-4 border-b border-white/5 pb-8">
           <div className="bg-indigo-600 p-3 rounded-2xl">
              <InfoIcon className="w-6 h-6 text-white" />
           </div>
           <h1 className="text-4xl font-black uppercase italic tracking-tighter">About CodeG3N</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-4">
              <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                 <Users className="w-5 h-5 text-indigo-500" /> Community Driven
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed uppercase tracking-tight">
                 CodeG3N is a community-driven Discord server built by enthusiasts for enthusiasts. We believe in providing value to our members through automated solutions.
              </p>
           </div>
           <div className="space-y-4">
              <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                 <Zap className="w-5 h-5 text-indigo-500" /> Automated services
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed uppercase tracking-tight">
                 Our system is focused on free automated services, reducing manual overhead and providing instant results for our active user base.
              </p>
           </div>
        </div>

        <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
           <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-indigo-500" />
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Our Mission</h3>
           </div>
           <p className="text-gray-400 text-sm leading-relaxed uppercase tracking-tight font-medium">
              We are powered by custom bots designed to scale. Our entire infrastructure is built for speed, fairness, and security. We aim to keep services accessible to everyone while maintaining a high level of protection against abuse.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Info;
