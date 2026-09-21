import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Building2,
  Globe,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('general');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(name, email, password, role);
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Kwiyandikisha byanze. Gerageza indi email/username cyangwa password ikomeye.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickClientFill = () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    setName(`Client ${randomId}`);
    setEmail(`client${randomId}`);
    setPassword('client123');
    setRole('general');
  };

  const roleOptions: { id: UserRole; title: string; desc: string; icon: any }[] = [
    {
      id: 'general',
      title: 'Umukiriya / Client (General)',
      desc: 'Kuganira na AI, guhindura indimi, no kubona amakuru',
      icon: Globe,
    },
    {
      id: 'student',
      title: 'Umunyeshuri (Student)',
      desc: 'Gufashwa mu masomo, quizzes, no kwiga porogaramu',
      icon: GraduationCap,
    },
    {
      id: 'professional',
      title: 'Umunyamwuga (Professional)',
      desc: "Kwandika emails, inyandiko z'akazi, no gusesengura",
      icon: Briefcase,
    },
    {
      id: 'business',
      title: 'Ubucuruzi (Business)',
      desc: "Ibyifuzo by'ibigo, abakiriya no gusesengura amakuru",
      icon: Building2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070c09] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center z-10 space-y-3">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            Kinya<span className="text-emerald-400">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Kwiyandikisha nka Client (Get Registered)
        </h2>
        <p className="text-xs text-slate-400">
          Ufite konti usanzwe ukoresha?{' '}
          <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
            Injira hano (Login)
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg z-10 px-4">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5">
          {/* Quick Client fill button */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0e1d13] border border-emerald-900/60 text-xs">
            <span className="text-slate-300">Ushaka kwiyandikisha byihuse?</span>
            <button
              type="button"
              onClick={handleQuickClientFill}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40 flex items-center gap-1 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Kora Client Ako Kanya</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Amazina yawe (Full Name)
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="urugero: Kalisa Eric cyangwa Client Name"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0c1610] border border-emerald-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email cyangwa Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="urugero: client1 cyangwa client@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0c1610] border border-emerald-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Ijambo ry'Ibanga (Password - nibura inyuguti 4)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={4}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0c1610] border border-emerald-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Role selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Hitamo Icyiciro (Role)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = role === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setRole(opt.id)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                          : 'bg-[#0c1610] border-emerald-950 text-slate-400 hover:border-emerald-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-200">{opt.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Kurema konti...' : 'Iyandikishe Ubu (Register Account)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
