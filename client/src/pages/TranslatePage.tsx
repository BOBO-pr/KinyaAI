import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Volume2,
  Copy,
  Check,
  Languages,
  Sparkles,
  RotateCcw,
  BookOpen,
  Trash2,
  Clock,
} from 'lucide-react';
import { translateAPI } from '../services/api';
import { TranslationItem } from '../types';

export const TranslatePage: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<'rw' | 'en'>('rw');
  const [targetLang, setTargetLang] = useState<'rw' | 'en'>('en');
  const [sourceText, setSourceText] = useState('Muraho, amakuru yawe?');
  const [translatedText, setTranslatedText] = useState('Hello, how are you?');
  const [formality, setFormality] = useState<'standard' | 'informal' | 'formal'>('standard');
  const [grammarNotes, setGrammarNotes] = useState<string>('Standard respectful greeting suitable for any time of day.');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<TranslationItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await translateAPI.getHistory();
      if (res.success) {
        setHistory(res.history);
      }
    } catch {
      // ignore
    }
  };

  const handleTranslate = async (textToTranslate?: string) => {
    const text = textToTranslate !== undefined ? textToTranslate : sourceText;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await translateAPI.translate({
        text,
        sourceLang,
        targetLang,
        formality,
      });

      if (res.success) {
        setTranslatedText(res.translation.translatedText);
        setGrammarNotes(res.translation.grammarNotes || '');
        loadHistory();
      }
    } catch (err: any) {
      console.error('Translation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLang((prev) => (prev === 'rw' ? 'en' : 'rw'));
    setTargetLang((prev) => (prev === 'rw' ? 'en' : 'rw'));
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakText = (text: string, lang: 'rw' | 'en') => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on your browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'rw' ? 'sw-TZ' : 'en-US'; // Use standard phonetics
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleClearHistory = async () => {
    await translateAPI.clearHistory();
    setHistory([]);
  };

  const commonPhrases = [
    { label: 'Muraho neza', lang: 'rw' },
    { label: 'Mwaramutse', lang: 'rw' },
    { label: 'Mwiriwe', lang: 'rw' },
    { label: "Ubwenge bw'ubukorano", lang: 'rw' },
    { label: 'Mudasobwa', lang: 'rw' },
    { label: 'Good morning', lang: 'en' },
    { label: 'Artificial Intelligence', lang: 'en' },
    { label: 'Thank you very much', lang: 'en' },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-950/70 border border-teal-800/80 text-xs font-semibold text-teal-300">
          <Languages className="w-3.5 h-3.5" />
          <span>Kinyarwanda ↔ English NLP Matrix</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Ubusemuzi n'Ururimi (Translator)
        </h1>
        <p className="text-sm text-slate-400">
          Hindura amagambo, interuro n'inyandiko mu buryo buhuje n'ikibonezamvugo nyacyo n'umuco.
        </p>
      </div>

      {/* Translation Workspace */}
      <div className="rounded-3xl glass-panel p-4 sm:p-6 space-y-6">
        {/* Controls bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-emerald-950/80">
          {/* Language Switcher */}
          <div className="flex items-center space-x-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#0c1610] border border-emerald-800 text-sm font-bold text-emerald-300">
              {sourceLang === 'rw' ? '🇷🇼 Ikinyarwanda' : '🇬🇧 English'}
            </span>

            <button
              onClick={handleSwapLanguages}
              className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 transition-colors"
              title="Hinduranya Indimi"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>

            <span className="px-3.5 py-1.5 rounded-xl bg-[#0c1610] border border-emerald-800 text-sm font-bold text-emerald-300">
              {targetLang === 'rw' ? '🇷🇼 Ikinyarwanda' : '🇬🇧 English'}
            </span>
          </div>

          {/* Formality options */}
          <div className="flex items-center space-x-1.5 bg-[#0a130e] p-1 rounded-xl border border-emerald-950">
            {(['standard', 'informal', 'formal'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormality(fmt)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  formality === fmt
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {fmt === 'formal' ? 'Icyubahiro (Formal)' : fmt === 'informal' ? 'Gusabana (Casual)' : 'Bisanzwe'}
              </button>
            ))}
          </div>
        </div>

        {/* Translation Boxes (Dual-pane) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Source Box */}
          <div className="flex flex-col justify-between rounded-2xl bg-[#0c1610] border border-emerald-900/60 p-4 min-h-[220px]">
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Andika amagambo ushaka guhindura hano..."
              rows={5}
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none resize-none text-base"
            />
            <div className="flex items-center justify-between pt-3 border-t border-emerald-950/60 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => speakText(sourceText, sourceLang)}
                  className="p-1.5 rounded-lg hover:text-emerald-400 hover:bg-[#122218] transition-colors"
                  title="Umva imivugirwe"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <span>{sourceText.length} inyuguti</span>
              </div>

              <button
                onClick={() => handleTranslate()}
                disabled={loading || !sourceText.trim()}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
              >
                {loading ? 'Irimo guhindura...' : 'Hindura (Translate)'}
              </button>
            </div>
          </div>

          {/* Target Translation Box */}
          <div className="flex flex-col justify-between rounded-2xl bg-[#0f1d14] border border-emerald-700/40 p-4 min-h-[220px]">
            <div className="text-slate-100 text-base leading-relaxed whitespace-pre-wrap">
              {loading ? (
                <div className="text-emerald-400/80 animate-pulse">Ubuhinduzi burimo gukorwa...</div>
              ) : (
                translatedText || <span className="text-slate-500">Ibisubizo biraza hano...</span>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-emerald-950/60 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => speakText(translatedText, targetLang)}
                  className="p-1.5 rounded-lg hover:text-emerald-400 hover:bg-[#122218] transition-colors"
                  title="Umva imivugirwe"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={copyResult}
                  className="flex items-center space-x-1 p-1.5 rounded-lg hover:text-emerald-400 hover:bg-[#122218] transition-colors"
                  title="Kopera"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <span className="text-[11px] text-emerald-400/80 font-medium">
                KinyaAI High Fidelity
              </span>
            </div>
          </div>
        </div>

        {/* Grammar & Cultural Context Notes */}
        {grammarNotes && (
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/50 flex items-start space-x-3">
            <BookOpen className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-emerald-300 uppercase tracking-wide">
                Ibisobanuro by'Ururimi & Ikibonezamvugo (Grammar Notes):
              </span>
              <p className="text-slate-300 leading-relaxed">{grammarNotes}</p>
            </div>
          </div>
        )}

        {/* Phrase Bank */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            💡 Amagambo akunda gukoreshwa (Common Phrases):
          </span>
          <div className="flex flex-wrap gap-2">
            {commonPhrases.map((phrase, i) => (
              <button
                key={i}
                onClick={() => {
                  setSourceLang(phrase.lang as any);
                  setTargetLang(phrase.lang === 'rw' ? 'en' : 'rw');
                  setSourceText(phrase.label);
                  handleTranslate(phrase.label);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#0c1610] hover:bg-[#15261b] border border-emerald-900 text-xs text-slate-200 hover:text-emerald-300 transition-colors"
              >
                {phrase.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" /> Amateka y'Ibyahinduwe (Translation History)
            </h3>
            <button
              onClick={handleClearHistory}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hanagura Amateka
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {history.map((item, idx) => (
              <div
                key={item._id || idx}
                onClick={() => {
                  setSourceText(item.sourceText);
                  setTranslatedText(item.translatedText);
                }}
                className="p-4 rounded-xl bg-[#0c1610] hover:bg-[#102016] border border-emerald-950 transition-colors cursor-pointer space-y-1 text-xs"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                  <span>{item.sourceLanguage} ➔ {item.targetLanguage}</span>
                  <span>{item.formality}</span>
                </div>
                <div className="text-slate-200 font-medium truncate">"{item.sourceText}"</div>
                <div className="text-emerald-300 truncate font-semibold">➔ {item.translatedText}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
