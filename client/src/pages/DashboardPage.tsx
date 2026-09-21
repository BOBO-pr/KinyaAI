import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Languages,
  GraduationCap,
  FileText,
  Zap,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import { DashboardStats, Conversation } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    chats: 8,
    translations: 14,
    lessonsCompleted: 3,
    documentsSummarized: 1,
    tokensUsed: 1250,
    tokensRemaining: 48750,
  });
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([]);
  const [recentTranslations, setRecentTranslations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardAPI.getStats();
        if (res.success) {
          setStats(res.stats);
          setRecentConversations(res.recentConversations || []);
          setRecentTranslations(res.recentTranslations || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Mwaramutse neza';
    if (hour < 18) return 'Mwiriwe neza';
    return 'Ijoro ryiza';
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-[#0d1d13] via-[#10291a] to-[#0d1d13] border border-emerald-500/30 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ikaze kuri KinyaAI Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              {getGreeting()}, {user?.name || 'Musomyi'}! 👋
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Uyu munsi ni umunsi mwiza wo kwiga, guhanga udushya no gukoresha ubwenge bw'ubukorano mu rurimi rw'Ikinyarwanda.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/app/chat"
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Fungura AI Chat</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Ibiganiro (Chats)</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats.chats}
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> Ibibazo wabajije
          </p>
        </div>

        {/* Metric 2 */}
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Ubusemuzi</span>
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-400">
              <Languages className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats.translations}
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> Interuro zahinduwe
          </p>
        </div>

        {/* Metric 3 */}
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Amasomo (Lessons)</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats.lessonsCompleted}
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> Quizzes zatsinzwe
          </p>
        </div>

        {/* Metric 4 */}
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Quota ya Tokens</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats.tokensUsed.toLocaleString()}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full"
              style={{ width: `${Math.min(100, Math.max(8, (stats.tokensUsed / 50000) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" /> Ibikorwa by'Ibanze (Quick Actions)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/app/chat"
            className="p-5 rounded-2xl bg-[#0c1610] hover:bg-[#112318] border border-emerald-900/60 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                AI Chat Studio
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Baza ikibazo cyangwa uganire mu Kinyarwanda.
              </p>
            </div>
          </Link>

          <Link
            to="/app/translate"
            className="p-5 rounded-2xl bg-[#0c1610] hover:bg-[#112318] border border-emerald-900/60 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                Hindura Ururimi
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kinyarwanda ↔ English n'ibisobanuro by'ikibonezamvugo.
              </p>
            </div>
          </Link>

          <Link
            to="/app/learn"
            className="p-5 rounded-2xl bg-[#0c1610] hover:bg-[#112318] border border-emerald-900/60 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Kwiga & Quizzes
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Wige JavaScript, Coding, n'Icyongereza cy'akazi.
              </p>
            </div>
          </Link>

          <Link
            to="/app/summarize"
            className="p-5 rounded-2xl bg-[#0c1610] hover:bg-[#112318] border border-emerald-900/60 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Sesengura Inyandiko
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Bona inshamake y'amadosiye na notes mu buryo bwihuse.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Chats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" /> Ibiganiro Byaherutse (Recent Chats)
            </h3>
            <Link to="/app/chat" className="text-xs text-emerald-400 hover:underline">
              Reba byose
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentConversations.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#0c1610] border border-emerald-950 text-center text-xs text-slate-400">
                Nta biganiro birabikwa. Kanda kuri "AI Chat Studio" utangire!
              </div>
            ) : (
              recentConversations.slice(0, 4).map((conv) => (
                <Link
                  key={conv._id}
                  to="/app/chat"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#0c1610] hover:bg-[#102016] border border-emerald-900/40 transition-colors group"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-200 truncate group-hover:text-emerald-300">
                      {conv.title}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 ml-2" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Translations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Languages className="w-4 h-4 text-teal-400" /> Ibyahinduwe Byaherutse (Translations)
            </h3>
            <Link to="/app/translate" className="text-xs text-teal-400 hover:underline">
              Reba byose
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentTranslations.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#0c1610] border border-emerald-950 text-center text-xs text-slate-400">
                Nta busemuzi burakorwa. Kanda kuri "Ururimi" utangire guhindura!
              </div>
            ) : (
              recentTranslations.slice(0, 4).map((trans, i) => (
                <div
                  key={trans._id || i}
                  className="p-3.5 rounded-xl bg-[#0c1610] border border-emerald-900/40 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="uppercase font-bold text-emerald-400">
                      {trans.sourceLanguage} ➔ {trans.targetLanguage}
                    </span>
                  </div>
                  <div className="text-slate-300 font-medium truncate">"{trans.sourceText}"</div>
                  <div className="text-emerald-300 truncate">➔ {trans.translatedText}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
