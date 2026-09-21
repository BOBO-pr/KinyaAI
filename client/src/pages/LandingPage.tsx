import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Languages,
  MessageSquare,
  GraduationCap,
  Mic,
  FileText,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { KinyaSphere } from '../components/common/KinyaSphere';
import { translateAPI } from '../services/api';

export const LandingPage: React.FC = () => {
  // Quick test translator state right on the hero
  const [quickInput, setQuickInput] = useState('Muraho, amakuru yawe?');
  const [quickOutput, setQuickOutput] = useState('Hello, how are you?');
  const [translating, setTranslating] = useState(false);

  const handleQuickTranslate = async () => {
    if (!quickInput.trim()) return;
    setTranslating(true);
    try {
      const res = await translateAPI.translate({
        text: quickInput,
        sourceLang: 'rw',
        targetLang: 'en',
      });
      if (res.success) {
        setQuickOutput(res.translation.translatedText);
      }
    } catch {
      setQuickOutput('Hello, how are you? (Demo translation)');
    } finally {
      setTranslating(false);
    }
  };

  const sampleConversations = [
    {
      q: 'Mfasha kwiga JavaScript mu Kinyarwanda.',
      a: 'Yego rwose! JavaScript ni ururimi rwiza cyane rwo gutangiriraho. Reka dutangirire kuri Variables (let na const) zifasha kubika amakuru muri mudasobwa.',
      tag: 'Kwiga Porogaramu',
    },
    {
      q: 'Nandikira email yo gusaba akazi mu Cyongereza.',
      a: 'Niteguye kugufasha. Dore interuro y\'ibanze:\n"Dear Hiring Team, I am writing to express my strong enthusiasm for the Software Developer position..."',
      tag: 'Akazi & Umwuga',
    },
    {
      q: 'Amagambo yo kuramutsa mu Kinyarwanda akoreshwa ate?',
      a: '"Muraho" ikoreshwa igihe cyose mu cyubahiro, "Mwaramutse" mu gitondo, na "Mwiriwe" ku gicamunsi n\'umugoroba.',
      tag: 'Umuco n\'Ururimi',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070c09] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden border-b border-emerald-950/60">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-600/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ubwenge bw'Ubukorano mu Kinyarwanda & Beyond</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                Kinya<span className="text-gradient-emerald">AI</span> — Umufasha Wawe <br className="hidden sm:inline" />
                Mu Kinyarwanda n'Icyongereza
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
                Urubuga rugezweho rwa AI rugufasha kuganira, guhindura indimi, kwiga porogaramu, gusesengura inyandiko no kongera umusaruro mu kazi ka buri munsi.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base transition-all shadow-xl shadow-emerald-500/25 hover:scale-[1.02]"
                >
                  <span>Tangira Gukoresha KinyaAI</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/app/chat"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-[#0e1c13] hover:bg-[#13281b] border border-emerald-800/80 text-emerald-200 font-semibold text-base transition-all"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <span>Gerageza AI Chat</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Kinyarwanda & English NLP</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ubuntu ku Baturarwanda (Free Tier)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Umutekano Uhamye (Encrypted)</span>
                </div>
              </div>
            </div>

            {/* Right: 3D Aesthetic Sphere & Quick Widget */}
            <div className="lg:col-span-5 flex flex-col items-center space-y-6">
              <KinyaSphere size="md" />

              {/* Interactive Quick Translator preview card */}
              <div className="w-full max-w-md rounded-2xl glass-card p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold border-b border-emerald-950/80 pb-2">
                  <span className="flex items-center gap-1">
                    <Languages className="w-3.5 h-3.5" /> Gerageza Guhindura (Live Test)
                  </span>
                  <span>RW ➔ EN</span>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    placeholder="Andika interuro mu Kinyarwanda..."
                    className="w-full bg-[#0c1610] border border-emerald-900 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-sm text-emerald-200 font-medium">
                    {translating ? 'Irimo guhindura...' : quickOutput}
                  </div>
                </div>

                <button
                  onClick={handleQuickTranslate}
                  disabled={translating}
                  className="w-full py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 transition-colors"
                >
                  {translating ? 'Guhindura...' : 'Hindura ubu (Translate Now)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-b border-emerald-950/60 bg-[#08100b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Ubwenge bw'Ubukorano bugezweho
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ibikoresho by'Ingenzi KinyaAI Iguha
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Yateguriwe guhaza ibyifuzo by'abanyeshuri, abarezi, n'abanyamwuga hagamijwe gukoresha AI mu buryo buborohereye.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Chat */}
            <div className="glass-card rounded-2xl p-7 space-y-4 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Chat mu Kinyarwanda</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ganira na KinyaAI mu rurimi rwawe. Baza ibibazo bya tekiniki, ibyerekeye amasomo, cyangwa ubutumwa bw'akazi.
              </p>
            </div>

            {/* Card 2: Translation */}
            <div id="translator" className="glass-card rounded-2xl p-7 space-y-4 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Guhindura Kinyarwanda ↔ English</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ubusemuzi bwizewe hagati y'Ikinyarwanda n'Icyongereza, buherekejwe n'ibisobanuro by'ikibonezamvugo n'umuco.
              </p>
            </div>

            {/* Card 3: Learning Center */}
            <div id="learning" className="glass-card rounded-2xl p-7 space-y-4 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Kwiga na AI Tutor</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Amasomo n'ibibazo (Quizzes) byo kwiga programming, icyongereza cy'akazi, n'umutekano w'ikoranabuhanga.
              </p>
            </div>

            {/* Card 4: Voice */}
            <div className="glass-card rounded-2xl p-7 space-y-4 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Ijwi & Voice Assistant</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Vugira muri microphone ukoresheje ijwi ryawe, KinyaAI yumve icyo uvuze kandi igusubize mu majwi.
              </p>
            </div>

            {/* Card 5: Document Summarizer */}
            <div className="glass-card rounded-2xl p-7 space-y-4 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Gusesengura Inyandiko</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Shyiramo inyandiko ndende (PDF cyangwa inyandiko), uhite ubona inshamake n'ingingo z'ingenzi mu masegonda.
              </p>
            </div>

            {/* Card 6: Security */}
            <div className="glass-card rounded-2xl p-7 space-y-4 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Umutekano n'Ubusugire</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Amakuru yawe arinzwe cyane, nta masiri y'akazi asangizwa hanze, kandi ibipimo biragenzurwa neza.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Kinyarwanda Dialogues Showcase */}
      <section className="py-20 bg-[#070c09] border-b border-emerald-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-white">Uko KinyaAI Isubiza Mu Kinyarwanda</h2>
            <p className="text-slate-400 mt-2">Ibisubizo bifite ireme, ikinyabupfura n'ikoranabuhanga rihamye.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleConversations.map((item, idx) => (
              <div key={idx} className="rounded-2xl bg-[#0c1610] border border-emerald-900/50 p-6 space-y-3">
                <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {item.tag}
                </span>
                <div className="text-sm font-semibold text-white">
                  👤 {item.q}
                </div>
                <div className="text-xs text-emerald-300/90 leading-relaxed bg-[#112117] p-3 rounded-xl border border-emerald-900/30 whitespace-pre-line">
                  🤖 {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-b border-emerald-950/60 bg-[#08100b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Gahunda y'Ibiciro
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Hitamo Porogaramu Igukwiriye
            </h2>
            <p className="text-slate-400 text-base">
              KinyaAI itangira ku buntu kuri buri wese wifuza kwiga no gukora ubushakashatsi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="rounded-2xl bg-[#0c1610] border border-emerald-900/60 p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Ubuntu (Free)</span>
                <div className="text-3xl font-extrabold text-white">0 RWF <span className="text-sm font-normal text-slate-400">/ ku kwezi</span></div>
                <p className="text-xs text-slate-400">Ku banyeshuri n'abantu bose batangiye gukoresha AI.</p>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-emerald-950">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI Chat mu Kinyarwanda n'Icyongereza</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Guhindura amagambo n'interuro</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Amasomo y'ibanze n'ibizamini (Quizzes)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Kugeza ku bihumbi 50 bya tokens</li>
                </ul>
              </div>
              <Link to="/register" className="mt-8 block text-center py-3 rounded-xl border border-emerald-700 hover:bg-emerald-950/40 text-emerald-300 text-sm font-semibold transition-colors">
                Tangira Ubuntu
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="rounded-2xl bg-gradient-to-b from-[#112318] to-[#0c1610] border-2 border-emerald-500 p-8 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-extrabold uppercase">
                Ikunzwe Cyane
              </div>
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Pro Scholar</span>
                <div className="text-3xl font-extrabold text-white">5,000 RWF <span className="text-sm font-normal text-slate-400">/ ku kwezi</span></div>
                <p className="text-xs text-slate-400">Ku banyamwuga, abashakashatsi n'abanyeshuri ba kaminuza.</p>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-emerald-950">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Byose biri muri Free tier</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Gusesengura inyandiko za PDF n'amadosiye</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Voice Assistant idafite imipaka</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Ubutumwa bwihuse cyane (High priority)</li>
                </ul>
              </div>
              <Link to="/register" className="mt-8 block text-center py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition-all shadow-lg shadow-emerald-500/20">
                Fata Pro Plan
              </Link>
            </div>

            {/* Business Tier */}
            <div className="rounded-2xl bg-[#0c1610] border border-emerald-900/60 p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Business & Enterprise</span>
                <div className="text-3xl font-extrabold text-white">Ibiganiro <span className="text-sm font-normal text-slate-400">(Custom)</span></div>
                <p className="text-xs text-slate-400">Ku bigo by'ubucuruzi, amashuri makuru n'ibigo bya leta.</p>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-emerald-950">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> API access yo guhuza na system y'ikigo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Amakuru y'ikigo yihariye (Private Models)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Team collaboration & Admin portal</li>
                </ul>
              </div>
              <Link to="/login" className="mt-8 block text-center py-3 rounded-xl border border-emerald-700 hover:bg-emerald-950/40 text-emerald-300 text-sm font-semibold transition-colors">
                Twandikire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-[#070c09] border-b border-emerald-950/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white">Ibibazo Bikunze Kubazwa (FAQ)</h2>
            <p className="text-slate-400 mt-2">Ibisubizo ku mikorere n'umutekano wa KinyaAI.</p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-[#0c1610] border border-emerald-900/40 space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" /> KinyaAI ikora ite mu Kinyarwanda?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                KinyaAI ikoresha uburyo bugezweho bwa Natural Language Processing bwize amagambo, imiterere n'ikibonezamvugo cy'ururimi rw'Ikinyarwanda kugira ngo itange ibisubizo bisobanutse kandi byubahirije umuco.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0c1610] border border-emerald-900/40 space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" /> Ese nshobora kuyikoresha kuri telefone?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                Yego rwose. KinyaAI yubatswe mu buryo bwa responsive web application ikora neza kuri telefone, tablets, no kuri mudasobwa (laptops/desktops).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0c1610] border border-emerald-900/40 space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" /> Ese amakuru yanjye arinzwe?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                Amakuru yawe arinzwe hakoreshejwe cryptographic standards zigezweho. Ntitugurisha cyangwa ngo dusangize amakuru yawe abandi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-[#0b1b11] via-[#0e2719] to-[#0b1b11] text-center border-b border-emerald-950/60">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Witeguye Kwinjira mu Kinyarwanda cya AI?
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Tangira uyu munsi ku buntu, wige, wandike code, uhindure indimi kandi wubake ejo hazaza hawe.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base transition-all shadow-xl shadow-emerald-500/25"
            >
              <span>Tangira Konti yawe Ubu</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
