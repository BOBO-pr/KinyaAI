import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Users,
  MessageSquare,
  Languages,
  Activity,
  Server,
  Star,
  RefreshCw,
  GraduationCap,
  KeyRound,
  Plus,
  X,
} from 'lucide-react';
import { adminAPI, learnAPI } from '../services/api';
import { Course } from '../types';

export const AdminPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [newTitleKinya, setNewTitleKinya] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newCategory, setNewCategory] = useState<any>('programming');
  const [newEnrollmentKey, setNewEnrollmentKey] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [courseCreating, setCourseCreating] = useState(false);

  useEffect(() => {
    loadOverview();
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await learnAPI.getCourses();
      if (res.success) {
        setCourses(res.courses);
      }
    } catch (err) {
      console.error('Failed to load courses for admin:', err);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleKinya || !newTitleEn || !newEnrollmentKey) return;

    setCourseCreating(true);
    try {
      const res = await learnAPI.createCourse({
        titleKinya: newTitleKinya,
        titleEn: newTitleEn,
        category: newCategory,
        enrollmentKey: newEnrollmentKey.trim().toUpperCase(),
        description: newDescription,
      });

      if (res.success) {
        alert('Isomo rishya ryakozwe neza!');
        setShowNewCourseModal(false);
        setNewTitleKinya('');
        setNewTitleEn('');
        setNewEnrollmentKey('');
        setNewDescription('');
        loadCourses();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gukora isomo byanze.');
    } finally {
      setCourseCreating(false);
    }
  };

  const loadOverview = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getOverview();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>KinyaAI Admin & Governance Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ubugenzuzi n'Imikorere ya System (Admin)
          </h1>
          <p className="text-sm text-slate-400">
            Kugenzura abakoresha urubuga, imikoreshereze ya tokens, amakuru ya server na feedback z'abaturage.
          </p>
        </div>

        <button
          onClick={loadOverview}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0e1d13] border border-emerald-900 text-xs text-emerald-300 hover:bg-[#14281c] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Vugurura (Refresh)</span>
        </button>
      </div>

      {/* System Health Card */}
      {data?.systemHealth && (
        <div className="p-6 rounded-3xl glass-card border border-emerald-500/30 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">System Status</span>
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{data.systemHealth.status.toUpperCase()}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Database</span>
            <div className="text-sm font-semibold text-slate-200">
              {data.systemHealth.database}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">AI Engine</span>
            <div className="text-sm font-semibold text-emerald-300">
              {data.systemHealth.aiEngine}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Memory & Uptime</span>
            <div className="text-sm font-semibold text-slate-200">
              {data.systemHealth.memoryUsedMB} MB / {data.systemHealth.uptime}
            </div>
          </div>
        </div>
      )}

      {/* Stats Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c1610] border border-emerald-900/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Abakoresha (Users)</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{data?.stats?.totalUsers || 0}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1610] border border-emerald-900/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Ibiganiro (Chats)</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{data?.stats?.totalConversations || 0}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1610] border border-emerald-900/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Ubusemuzi</span>
            <Languages className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{data?.stats?.totalTranslations || 0}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1610] border border-emerald-900/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Feedback</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{data?.stats?.totalFeedback || 0}</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl glass-panel p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" /> Urutonde rw'Abakoresha (Registered Accounts)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase tracking-wider border-b border-emerald-950/80">
              <tr>
                <th className="py-3 px-4">Amazina</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Chats</th>
                <th className="py-3 px-4">Translations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/50 text-slate-200">
              {data?.users?.map((u: any) => (
                <tr key={u._id} className="hover:bg-[#0e1d13] transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{u.name}</td>
                  <td className="py-3 px-4 text-slate-400">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">{u.usageCount?.chat || 0}</td>
                  <td className="py-3 px-4">{u.usageCount?.translations || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course & Enrollment Key Management Section */}
      <div className="rounded-3xl glass-panel p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-950/80 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Gucunga Amasomo n'Ibizamini (Courses & Enrollment Keys)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Kugenzura amasomo, Enrollment Keys z'abanyeshuri, umukoro w'ibibazo 50, n'ikizamini cy'ibibazo 20 bikomeye byo guhesha Certificate.
            </p>
          </div>

          <button
            onClick={() => setShowNewCourseModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/15 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ongeramo Isomo Rishya</span>
          </button>
        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase tracking-wider border-b border-emerald-950/80">
              <tr>
                <th className="py-3 px-4">Umutwe w'Isomo</th>
                <th className="py-3 px-4">Icyiciro</th>
                <th className="py-3 px-4">Enrollment Key</th>
                <th className="py-3 px-4">Modules</th>
                <th className="py-3 px-4">Umukoro (50 Qs)</th>
                <th className="py-3 px-4">Exam (20 Hardest)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/50 text-slate-200">
              {courses.map((c) => (
                <tr key={c.slug} className="hover:bg-[#0e1d13] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{c.titleKinya}</div>
                    <div className="text-[11px] text-slate-400">{c.titleEn}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#0f2418] border border-amber-500/40 text-amber-300 font-mono font-bold">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      <span>{c.enrollmentKey || 'KINYA2026'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">{c.totalModules || c.modules?.length || 0}</td>
                  <td className="py-3 px-4 text-slate-300 font-semibold">{c.assignmentQuestionsCount || 50} Qs</td>
                  <td className="py-3 px-4 text-amber-300 font-bold">{c.examQuestionsCount || 20} Qs (&ge;75%)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Course Modal */}
      {showNewCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0c1610] border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-5">
            <button
              onClick={() => setShowNewCourseModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                Admin Course Generator
              </span>
              <h3 className="text-lg font-bold text-white">
                Ongeramo Isomo Rishya n'Enrollment Key
              </h3>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Umutwe mu Kinyarwanda (Title Kinyarwanda)
                </label>
                <input
                  type="text"
                  required
                  value={newTitleKinya}
                  onChange={(e) => setNewTitleKinya(e.target.value)}
                  placeholder="urugero: Kwiga Ubwenge bw'Ubukorano (AI) mu Kinyarwanda"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09120c] border border-emerald-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Umutwe mu Cyongereza (Title English)
                </label>
                <input
                  type="text"
                  required
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  placeholder="e.g. Artificial Intelligence & Machine Learning"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09120c] border border-emerald-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Icyiciro (Category)</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#09120c] border border-emerald-900 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="programming">Programming</option>
                    <option value="language">Language</option>
                    <option value="business">Business</option>
                    <option value="stem">STEM & AI</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-amber-300 mb-1">
                    🔑 Enrollment Key
                  </label>
                  <input
                    type="text"
                    required
                    value={newEnrollmentKey}
                    onChange={(e) => setNewEnrollmentKey(e.target.value)}
                    placeholder="urugero: KINYA-AI-2026"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#09120c] border border-amber-500/50 text-amber-300 font-mono font-bold placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Ibisobanuro (Description)</label>
                <textarea
                  required
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Sobanura muri make ibyo abanyeshuri baziga n'impamvu by'ingenzi..."
                  className="w-full p-3 rounded-xl bg-[#09120c] border border-emerald-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0f2418] border border-emerald-500/30 text-[11px] text-slate-300 space-y-1">
                <div className="font-bold text-emerald-400">✨ Byikora (Auto-Equipped):</div>
                <p>
                  Iri somo rirahita ryinjizwamo umukoro mugari w'ibibazo 50 n'ikizamini cy'ibibazo 20 bikomeye byo guhesha Certificate ku manota &ge; 75%.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCourseModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-emerald-900 text-slate-400 hover:text-white"
                >
                  Reka
                </button>
                <button
                  type="submit"
                  disabled={courseCreating}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  {courseCreating ? 'Gukora isomo...' : 'Bika Isomo Rishya'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Inbox */}
      {data?.feedback && data.feedback.length > 0 && (
        <div className="rounded-3xl glass-panel p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" /> Ibitekerezo by'Abakoresha (User Feedback)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.feedback.map((fb: any, i: number) => (
              <div key={fb._id || i} className="p-4 rounded-2xl bg-[#0c1610] border border-emerald-900/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300 uppercase">{fb.feature}</span>
                  <div className="flex text-amber-400">
                    {'★'.repeat(fb.rating)}
                    <span className="text-slate-600">{'★'.repeat(5 - fb.rating)}</span>
                  </div>
                </div>
                <p className="text-slate-300">{fb.comment || 'Nta magambo yongeweho.'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
