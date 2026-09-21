import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-emerald-950/80 bg-[#060b08] text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Kinya<span className="text-emerald-400">AI</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your conversational AI assistant in Kinyarwanda & English. Empowering students, educators, and professionals across Rwanda and Africa.
          </p>
          <div className="flex items-center space-x-2 text-xs text-emerald-400/90 font-medium">
            <span>🇷🇼 Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>in Kigali, Rwanda</span>
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
            Ibikoresho (Features)
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/app/chat" className="hover:text-emerald-400">AI Chat & Assistant</Link></li>
            <li><Link to="/app/translate" className="hover:text-emerald-400">Kinyarwanda Translator</Link></li>
            <li><Link to="/app/learn" className="hover:text-emerald-400">Learn Programming & English</Link></li>
            <li><Link to="/app/voice" className="hover:text-emerald-400">Voice Assistant Studio</Link></li>
            <li><Link to="/app/summarize" className="hover:text-emerald-400">Document Summarizer</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
            Ubumenyi (Resources)
          </h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#features" className="hover:text-emerald-400">Amakuru kuri KinyaAI</a></li>
            <li><a href="#pricing" className="hover:text-emerald-400">Gahunda y'Ibiciro</a></li>
            <li><a href="#faq" className="hover:text-emerald-400">Ibibazo & Ibisubizo</a></li>
            <li><span className="text-slate-500">API Documentation (Coming soon)</span></li>
          </ul>
        </div>

        {/* Security & Mission */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
            Umutekano & Ubusugire
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Amakuru yawe arinzwe hakoreshejwe cryptographic standards zigezweho. Ntitugurisha cyangwa ngo dusangize amakuru yawe abandi.
          </p>
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} KinyaAI. Uburenganzira bwose burabitswe.
          </div>
        </div>
      </div>
    </footer>
  );
};
