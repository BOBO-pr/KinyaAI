import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Trophy,
  Award,
  Medal,
  Sparkles,
  Search,
  RefreshCw,
  GraduationCap,
  Star,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface Scholar {
  name: string;
  averageScore: number;
  examsPassed: number;
  certificatesCount: number;
  location?: string;
  badge: string;
}

export const LeaderboardPage: React.FC = () => {
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/learn/leaderboard');
      if (res.data.success) {
        setScholars(res.data.leaderboard);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const filteredScholars = scholars.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top1 = scholars[0];
  const top2 = scholars[1];
  const top3 = scholars[2];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-xs font-bold text-amber-300">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Urutonde rw'Indashyikirwa • National Academic Leaderboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Amasomo, Amanota n'Impamyabumenyi z'Indashyikirwa
          </h1>
          <p className="text-sm text-slate-400">
            Abanyeshuri n'abanyamuryango ba KinyaAI bahize abandi mu bizamini bikomeye by'ikoranabuhanga n'amasomo yose.
          </p>
        </div>

        <button
          onClick={fetchLeaderboard}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#0c1a10] hover:bg-[#102417] border border-emerald-800 text-xs font-semibold text-emerald-300 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Vugurura (Refresh)</span>
        </button>
      </div>

      {/* PODIUM OF TOP 3 CHAMPIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-4 items-end">
        {/* Rank 2 (Silver) */}
        {top2 && (
          <div className="rounded-3xl bg-[#09170e] border-2 border-slate-400/50 p-6 text-center space-y-3 order-2 md:order-1 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-slate-300/20 border-2 border-slate-300 text-slate-200 flex items-center justify-center mx-auto text-2xl font-black shadow-md">
              🥈 2
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{top2.name}</h3>
              <p className="text-xs text-slate-400">{top2.location || 'Rwanda'}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#06110a] border border-emerald-950">
              <span className="text-2xl font-black text-slate-200">{top2.averageScore}%</span>
              <span className="text-[10px] text-slate-400 block">Impuzandengo y'Amanota</span>
            </div>
            <span className="inline-block text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold">
              {top2.badge}
            </span>
          </div>
        )}

        {/* Rank 1 (Gold Champion) */}
        {top1 && (
          <div className="rounded-3xl bg-gradient-to-b from-[#1c2c15] to-[#07130b] border-2 border-amber-400 p-8 text-center space-y-4 order-1 md:order-2 shadow-2xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-widest shadow-md">
              👑 Champion
            </div>
            <div className="w-20 h-20 rounded-full bg-amber-400/20 border-4 border-amber-400 text-amber-300 flex items-center justify-center mx-auto text-3xl font-black shadow-xl shadow-amber-500/25">
              🥇 1
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{top1.name}</h3>
              <p className="text-xs text-amber-300 font-semibold">{top1.location || 'Kigali, Rwanda'}</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#06110a] border border-amber-500/40">
              <span className="text-3xl font-black text-amber-300">{top1.averageScore}%</span>
              <span className="text-[10px] text-slate-400 block">Impuzandengo y'Amanota Yose</span>
            </div>
            <span className="inline-block text-xs px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black">
              {top1.badge}
            </span>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {top3 && (
          <div className="rounded-3xl bg-[#09170e] border-2 border-amber-700/50 p-6 text-center space-y-3 order-3 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-amber-700/20 border-2 border-amber-700 text-amber-600 flex items-center justify-center mx-auto text-2xl font-black shadow-md">
              🥉 3
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{top3.name}</h3>
              <p className="text-xs text-slate-400">{top3.location || 'Rwanda'}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#06110a] border border-emerald-950">
              <span className="text-2xl font-black text-amber-500">{top3.averageScore}%</span>
              <span className="text-[10px] text-slate-400 block">Impuzandengo y'Amanota</span>
            </div>
            <span className="inline-block text-[10px] px-2.5 py-1 rounded-full bg-amber-950 text-amber-400 font-bold">
              {top3.badge}
            </span>
          </div>
        )}
      </div>

      {/* FULL LEADERBOARD TABLE */}
      <div className="rounded-3xl glass-panel p-6 space-y-5 border border-emerald-900/60 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-base font-bold text-white">
            Urutonde Rurambuye rw'Indashyikirwa (Full National Rankings)
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Shakisha umunyeshuri..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#09180e] border border-emerald-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-emerald-950 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Umwanya (#)</th>
                <th className="pb-3">Amazina y'Umunyeshuri</th>
                <th className="pb-3 text-center">Ibizamini Byatsinzwe</th>
                <th className="pb-3 text-center">Amanota y'Impuzandengo</th>
                <th className="pb-3">Urwego rw'Ishimwe (Badge)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60 font-medium">
              {filteredScholars.map((s, idx) => (
                <tr key={idx} className="hover:bg-emerald-950/20 transition-colors">
                  <td className="py-3.5 pl-2 font-bold text-slate-400">
                    {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                  </td>
                  <td className="py-3.5 font-bold text-white flex items-center space-x-2">
                    <span>{s.name}</span>
                    {s.location && (
                      <span className="text-[10px] text-slate-400 font-normal">({s.location})</span>
                    )}
                  </td>
                  <td className="py-3.5 text-center text-emerald-400 font-bold">
                    {s.examsPassed} / {s.certificatesCount || s.examsPassed}
                  </td>
                  <td className="py-3.5 text-center">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-black">
                      {s.averageScore}%
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="text-[11px] font-bold text-slate-300">
                      {s.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
