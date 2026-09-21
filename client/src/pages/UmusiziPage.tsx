import React, { useState, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Feather,
  Flame,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Trophy,
  Copy,
  Check,
  Send,
  Wand2,
  BookOpen,
  SpellCheck,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

interface Riddle {
  id: string;
  prompt: string;
  question: string;
  difficulty: string;
}

interface GrammarIssue {
  original: string;
  suggestion: string;
  rule: string;
  explanation: string;
}

export const UmusiziPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'riddles' | 'poetry' | 'spellcheck'>('riddles');

  // --- TAB 1: RIDDLES STATE ---
  const [currentRiddle, setCurrentRiddle] = useState<Riddle | null>(null);
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [riddleResult, setRiddleResult] = useState<any>(null);
  const [riddleScore, setRiddleScore] = useState(0);
  const [riddleStreak, setRiddleStreak] = useState(0);
  const [riddleLoading, setRiddleLoading] = useState(false);
  const [checkingAnswer, setCheckingAnswer] = useState(false);

  // --- TAB 2: POETRY STATE ---
  const [poetryGenre, setPoetryGenre] = useState('inka');
  const [poetryTopic, setPoetryTopic] = useState('Imparamba n\'ubwiza bw\'Inyambo');
  const [poetryLoading, setPoetryLoading] = useState(false);
  const [generatedPoem, setGeneratedPoem] = useState<any>(null);
  const [copiedPoem, setCopiedPoem] = useState(false);

  // --- TAB 3: SPELLCHECK STATE ---
  const [inputText, setInputText] = useState('Kubwanjye ndumva nanje nifuza kwiga mugihe cyose byoose bimeze neza.');
  const [spellLoading, setSpellLoading] = useState(false);
  const [spellResult, setSpellResult] = useState<any>(null);
  const [copiedCleanText, setCopiedCleanText] = useState(false);

  // Fetch initial riddle
  const fetchRandomRiddle = async () => {
    setRiddleLoading(true);
    setRiddleResult(null);
    setRiddleAnswer('');
    try {
      const res = await axios.get('http://localhost:5000/api/culture/riddles/random');
      if (res.data.success) {
        setCurrentRiddle(res.data.riddle);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRiddleLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomRiddle();
  }, []);

  const handleCheckRiddle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRiddle || !riddleAnswer.trim()) return;
    setCheckingAnswer(true);

    try {
      const res = await axios.post('http://localhost:5000/api/culture/riddles/check', {
        riddleId: currentRiddle.id,
        answer: riddleAnswer,
      });

      if (res.data.success) {
        setRiddleResult(res.data);
        if (res.data.isCorrect) {
          setRiddleScore((prev) => prev + 10);
          setRiddleStreak((prev) => prev + 1);
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.6 },
          });
        } else {
          setRiddleStreak(0);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingAnswer(false);
    }
  };

  const handleGeneratePoem = async (e: React.FormEvent) => {
    e.preventDefault();
    setPoetryLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/culture/poetry/generate', {
        type: poetryGenre === 'proverb' ? 'proverb' : 'poem',
        topic: poetryTopic,
      });
      if (res.data.success) {
        setGeneratedPoem(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPoetryLoading(false);
    }
  };

  const handleCheckSpelling = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setSpellLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/culture/spellcheck', {
        text: inputText,
      });
      if (res.data.success) {
        setSpellResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSpellLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 text-slate-100">
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-xs font-bold text-amber-300">
          <Feather className="w-3.5 h-3.5 text-amber-300" />
          <span>Umusizi AI • Rwandan Cultural Studio & Wisdom</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Ibisakuzo, Ibisigo Nyarwanda, Imigani n'Ikosora-Nteruro
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Wige kandi wishimire umuco nyarwanda: kora umukino w'ibisakuzo, uhimbe ibisigo n'amazina y'inka, unakosore imyandikire y'Ikinyarwanda neza.
        </p>
      </div>

      {/* 3 Main Tabs Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#0c1610] border border-emerald-950">
        <button
          onClick={() => setActiveTab('riddles')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'riddles'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>1. 🧩 Ibisakuzo (Riddles Game)</span>
          {riddleScore > 0 && (
            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black">
              {riddleScore} pts
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('poetry')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'poetry'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Feather className="w-4 h-4" />
          <span>2. 📜 Ibisigo n'Imigani (Poetry & Proverbs)</span>
        </button>

        <button
          onClick={() => setActiveTab('spellcheck')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'spellcheck'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <SpellCheck className="w-4 h-4" />
          <span>3. ✍️ Ikosora-Nteruro (Grammar & Spacing)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: IBISAKUZO (RWANDAN RIDDLES GAME) */}
      {/* ========================================================================= */}
      {activeTab === 'riddles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Riddle Arena */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl glass-panel p-6 sm:p-10 space-y-6 border border-amber-500/40 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black tracking-widest uppercase">
                    Sakwe Sakwe!
                  </span>
                  <span className="text-xs text-slate-400 font-serif italic">
                    (Uvuga uti: "Soma!")
                  </span>
                </div>

                <button
                  onClick={fetchRandomRiddle}
                  disabled={riddleLoading}
                  className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${riddleLoading ? 'animate-spin' : ''}`} />
                  <span>Ikindi Gisakuzo</span>
                </button>
              </div>

              {/* Riddle Question */}
              {currentRiddle && (
                <div className="py-4 border-y border-emerald-950 space-y-2">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-relaxed">
                    "{currentRiddle.question}"
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Urwego rw'uburemere: <strong className="text-amber-400 capitalize">{currentRiddle.difficulty}</strong>
                  </span>
                </div>
              )}

              {/* User Answer Form */}
              <form onSubmit={handleCheckRiddle} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Igisubizo cyawe:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={riddleAnswer}
                      onChange={(e) => setRiddleAnswer(e.target.value)}
                      placeholder="urugero: Uruzi, Ijisho, Agatsinsino..."
                      className="flex-1 px-4 py-3 rounded-2xl bg-[#09180e] border border-emerald-900 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-semibold"
                      disabled={checkingAnswer || (riddleResult && riddleResult.isCorrect)}
                    />
                    <button
                      type="submit"
                      disabled={checkingAnswer || !riddleAnswer.trim()}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg transition-all disabled:opacity-50"
                    >
                      {checkingAnswer ? 'Gusuzuma...' : 'Soma! (Submit)'}
                    </button>
                  </div>
                </div>
              </form>

              {/* Evaluation Result */}
              {riddleResult && (
                <div
                  className={`p-5 rounded-2xl border space-y-2 animate-in fade-in duration-300 ${
                    riddleResult.isCorrect
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-600 text-rose-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold text-base">
                    {riddleResult.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>Watsinze! (+10 Points)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-rose-400" />
                        <span>Ntabwo ari cyo neza!</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    <strong>Igisubizo nyacyo:</strong>{' '}
                    <span className="underline font-bold">{riddleResult.correctAnswer}</span>
                  </p>
                  <p className="text-xs text-slate-300 italic pt-1">
                    💡 <strong>Ibisobanuro mu muco:</strong> {riddleResult.explanation}
                  </p>

                  <button
                    onClick={fetchRandomRiddle}
                    className="mt-3 px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-md"
                  >
                    Komeza ku Kindi Gisakuzo →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Gamification Stats Sidebar */}
          <div className="space-y-6">
            <div className="rounded-3xl glass-panel p-6 space-y-6 border border-emerald-900/60">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Amanota y'Ibisakuzo</h4>
                  <p className="text-xs text-slate-400">Riddle Championship</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#091a0f] border border-emerald-950 text-center space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Amanota</span>
                  <span className="text-2xl font-black text-amber-300">{riddleScore}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#091a0f] border border-emerald-950 text-center space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Streak</span>
                  <span className="text-2xl font-black text-emerald-400 flex items-center justify-center gap-1">
                    {riddleStreak} <Flame className="w-4 h-4 text-amber-400 inline" />
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#061209] border border-emerald-950 text-xs text-slate-300 space-y-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                  Amategeko y'Ibisakuzo:
                </span>
                <p>1. Iyo umuhanga avuze "Sakwe sakwe", uwo abwira asubiza "Soma!".</p>
                <p>2. Buri gisubizo cy'ukuri kiguhesha amanota 10 n'inyongera ya Streak 🔥.</p>
                <p>3. Gutsinda ibisakuzo 5 bikurikirana bikongerera ubuhanga mu Kinyarwanda!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: IBISIGO N'IMIGANI (POETRY & PROVERBS) */}
      {/* ========================================================================= */}
      {activeTab === 'poetry' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <form onSubmit={handleGeneratePoem} className="rounded-3xl glass-panel p-6 space-y-5 border border-emerald-900/60">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Guhimba no Gusesengura</h3>
                <p className="text-xs text-slate-400">Hitamo ubwoko bw'ubuvanganzo n'insanganyamatsiko.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Ubwoko (Category)
                </label>
                <select
                  value={poetryGenre}
                  onChange={(e) => setPoetryGenre(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a180e] border border-emerald-900 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
                >
                  <option value="inka">🐄 Amazina y'Inka (Praise of Cattle & Milk)</option>
                  <option value="ubutwari">⚔️ Imivugo y'Ubutwari (Bravery & Patriotism)</option>
                  <option value="urukundo">❤️ Urukundo n'Uburanga (Love & Beauty)</option>
                  <option value="proverb">📜 Imigani y'Imigenurano (Proverb Analysis)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Insanganyamatsiko (Topic / Proverb)
                </label>
                <input
                  type="text"
                  value={poetryTopic}
                  onChange={(e) => setPoetryTopic(e.target.value)}
                  placeholder="urugero: Imparamba, Ubutwari, Agasozi k'ishyanga..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a180e] border border-emerald-900 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={poetryLoading || !poetryTopic.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Wand2 className="w-4 h-4" />
                <span>{poetryLoading ? 'Umusizi arimo gutekereza...' : 'Himbariza Ubu (Compose/Analyze)'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            {generatedPoem ? (
              <div className="rounded-3xl bg-[#06110a] border-2 border-amber-400/80 p-6 sm:p-10 space-y-6 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                      Umusizi AI • Ikinyarwanda cy'Umwimerere
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white pt-1">
                      {generatedPoem.title || generatedPoem.proverb}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      const textToCopy = generatedPoem.verses
                        ? generatedPoem.verses.join('\n')
                        : `${generatedPoem.meaning}\n\n${generatedPoem.culturalContext}`;
                      navigator.clipboard.writeText(textToCopy);
                      setCopiedPoem(true);
                      setTimeout(() => setCopiedPoem(false), 2000);
                    }}
                    className="flex items-center space-x-1 text-xs px-3 py-1.5 rounded-xl bg-[#0c1e12] border border-emerald-800 text-emerald-300"
                  >
                    {copiedPoem ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPoem ? 'Byakopiwe!' : 'Kopera'}</span>
                  </button>
                </div>

                {generatedPoem.verses ? (
                  <div className="space-y-3 py-2 font-serif text-base sm:text-lg text-amber-200/90 leading-relaxed italic border-l-2 border-amber-400 pl-6">
                    {generatedPoem.verses.map((v: string, idx: number) => (
                      <p key={idx}>{v}</p>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 text-sm text-slate-200 leading-relaxed">
                    <p><strong>Igisobanuro:</strong> {generatedPoem.meaning}</p>
                    <p className="text-slate-300"><strong>Amavu n'Amavuko:</strong> {generatedPoem.culturalContext}</p>
                    <p className="text-amber-300"><strong>Inama:</strong> {generatedPoem.advice}</p>
                  </div>
                )}

                {generatedPoem.analysis && (
                  <div className="pt-4 border-t border-emerald-950 text-xs text-slate-400 leading-relaxed">
                    💡 <strong>Ubusesenguzi:</strong> {generatedPoem.analysis}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full rounded-3xl glass-panel p-12 text-center flex flex-col items-center justify-center space-y-3 border border-emerald-950">
                <Feather className="w-12 h-12 text-amber-400/40" />
                <h4 className="text-base font-bold text-slate-300">Hitamo Insanganyamatsiko</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Kanda button yo guhimba kugira ngo Umusizi AI aguhe ibisigo nyarwanda cyangwa ubusobanuro bw'imigani y'imigenurano.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: IKOSORA-NTERURO (GRAMMAR & SPELLING CHECKER) */}
      {/* ========================================================================= */}
      {activeTab === 'spellcheck' && (
        <div className="space-y-6">
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-5 border border-emerald-900/60 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Ikosora-Nteruro ry'Ikinyarwanda (Orthography & Grammar Checker)
                </h3>
                <p className="text-xs text-slate-400">
                  Andika cyangwa ukope inyandiko ushaka gukosora imyandikire y'amagambo, ibimenyetso, n'itandukanywa ry'amagambo.
                </p>
              </div>
            </div>

            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Andika inyandiko y'Ikinyarwanda hano..."
              className="w-full p-4 rounded-2xl bg-[#09180e] border border-emerald-900 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed"
            />

            <div className="flex justify-between items-center">
              <button
                onClick={() => setInputText('Kubwanjye ndumva nanje nifuza kwiga mugihe cyose byoose bimeze neza.')}
                className="text-xs text-amber-400 hover:underline"
              >
                Koresha Urugero rw'Amakosa (Load Example)
              </button>

              <button
                onClick={handleCheckSpelling}
                disabled={spellLoading || !inputText.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black text-xs shadow-md transition-all flex items-center space-x-2"
              >
                <SpellCheck className="w-4 h-4" />
                <span>{spellLoading ? 'Kugenzura...' : 'Kosora Inyandiko (Check Grammar)'}</span>
              </button>
            </div>
          </div>

          {/* Spell Results */}
          {spellResult && (
            <div className="rounded-3xl bg-[#06110a] border border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-emerald-950 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Ibyavuye mu Bugenzuzi</h4>
                    <p className="text-xs text-slate-400">{spellResult.message}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(spellResult.correctedText);
                    setCopiedCleanText(true);
                    setTimeout(() => setCopiedCleanText(false), 2000);
                  }}
                  className="flex items-center space-x-1 text-xs px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold"
                >
                  {copiedCleanText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCleanText ? 'Yakopiwe!' : 'Kopera Inyandiko Ikosoye'}</span>
                </button>
              </div>

              {/* Corrected Text Box */}
              <div className="p-4 rounded-2xl bg-[#091a0f] border border-emerald-500/30 text-sm text-emerald-200 leading-relaxed font-semibold">
                {spellResult.correctedText}
              </div>

              {/* Identified Issues */}
              {spellResult.issues && spellResult.issues.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Amakosa n'Inama Z'Uburyo bwo Kuyakosora:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {spellResult.issues.map((issue: GrammarIssue, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-[#0b1f13] border border-emerald-950 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="line-through text-rose-400 font-bold">{issue.original}</span>
                          <span className="text-emerald-400 font-bold">→ {issue.suggestion}</span>
                        </div>
                        <p className="text-[11px] text-slate-300">{issue.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UmusiziPage;
