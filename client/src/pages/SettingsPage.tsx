import React, { useState } from 'react';
import { Settings, User, Key, Globe, Shield, Save, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState(localStorage.getItem('kinya_custom_gemini_key') || '');
  const [preferredLang, setPreferredLang] = useState('rw');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey) {
      localStorage.setItem('kinya_custom_gemini_key', apiKey);
    } else {
      localStorage.removeItem('kinya_custom_gemini_key');
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-300">
          <Settings className="w-3.5 h-3.5" />
          <span>Igenamiterere (Preferences & Security)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Igenamiterere rya Konti (Settings)
        </h1>
        <p className="text-sm text-slate-400">
          Genzura imyirondoro yawe, ururimi ukunda, n'uburyo AI ikora.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Profile Card */}
        <div className="rounded-3xl glass-panel p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" /> Umwirondoro w'Umukoresha (Profile)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Amazina (Name)</label>
              <input
                type="text"
                disabled
                value={user?.name || ''}
                className="w-full p-2.5 rounded-xl bg-[#0c1610] border border-emerald-950 text-slate-300 opacity-80"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Email</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full p-2.5 rounded-xl bg-[#0c1610] border border-emerald-950 text-slate-300 opacity-80"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Icyiciro (Role)</label>
              <input
                type="text"
                disabled
                value={user?.role?.toUpperCase() || ''}
                className="w-full p-2.5 rounded-xl bg-[#0c1610] border border-emerald-950 text-emerald-400 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Tokens Zakoreshejwe</label>
              <input
                type="text"
                disabled
                value={`${user?.usageCount?.tokens || 1250} / 50,000`}
                className="w-full p-2.5 rounded-xl bg-[#0c1610] border border-emerald-950 text-slate-300"
              />
            </div>
          </div>
        </div>

        {/* AI & API Key Settings */}
        <div className="rounded-3xl glass-panel p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" /> AI Engine Configuration
          </h3>
          <p className="text-xs text-slate-400">
            KinyaAI ikoresha by'ibanze uburyo bwite bwa KinyaAI NLP engine. Ushobora no gushyiramo Google Gemini API Key yawe bwite niba uyifite.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Google Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full p-2.5 rounded-xl bg-[#0c1610] border border-emerald-900 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Language Preferences */}
        <div className="rounded-3xl glass-panel p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" /> Ururimi rw'Ibanze (Default Language)
          </h3>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPreferredLang('rw')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center space-x-2 ${
                preferredLang === 'rw'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-[#0c1610] border-emerald-950 text-slate-400'
              }`}
            >
              <span>🇷🇼 Ikinyarwanda (Default)</span>
            </button>
            <button
              type="button"
              onClick={() => setPreferredLang('en')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center space-x-2 ${
                preferredLang === 'en'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-[#0c1610] border-emerald-950 text-slate-400'
              }`}
            >
              <span>🇬🇧 English</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Byabitswe!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Bika Igenamiterere (Save Settings)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
