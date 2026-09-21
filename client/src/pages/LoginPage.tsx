import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  UserPlus,
  KeyRound,
  CheckCircle2,
  X,
  Crown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetCodeReceived, setResetCodeReceived] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (location.state as any)?.from?.pathname || '/app/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirectPath);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Kwinjira byanze. Reba email/username na password byawe, cyangwa ukande "Wibagiwe Password".'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAdminBoboLogin = async () => {
    setEmail('bobo');
    setPassword('bobo');
    setError(null);
    setLoading(true);
    try {
      await login('bobo', 'bobo');
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed for bobo');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin(role);
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.response?.data?.message || "Kwinjira nk'umushyitsi byanze.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);
    try {
      const res = await authAPI.forgotPassword(forgotEmail);
      if (res.success) {
        setResetCodeReceived(res.resetCode || '123456');
        setForgotMessage(res.message);
        setForgotStep(2);
      }
    } catch (err: any) {
      setForgotError(err.response?.data?.message || 'Nta konti ifite iyo email yabonetse.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);
    try {
      const res = await authAPI.resetPassword({
        email: forgotEmail,
        newPassword,
      });
      if (res.success) {
        alert('Password yawe yahinduwe neza! Ubu ushobora kwinjira.');
        setShowForgotModal(false);
        setPassword(newPassword);
        setEmail(forgotEmail);
      }
    } catch (err: any) {
      setForgotError(err.response?.data?.message || 'Guhindura password byanze.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070c09] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 space-y-3">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            Kinya<span className="text-emerald-400">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white">Injira muri Konti yawe</h2>
        <p className="text-xs text-slate-400">
          Ufite konti? Shyiramo imyirondoro yawe hasi.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 space-y-4">
        {/* Banner: Forgot to Register as a Client? */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#10291a] to-emerald-950/60 border border-emerald-500/40 text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Wibagiwe Kwiyandikisha?</span>
              <span className="text-slate-400 text-[11px]">Forgot to register as a client?</span>
            </div>
          </div>
          <Link
            to="/register"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 transition-colors"
          >
            Iyandikishe (Register)
          </Link>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Special Admin bobo / bobo button */}
          <div className="p-3 rounded-xl bg-[#0e1f14] border border-emerald-500/40 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Admin Credentials: bobo / bobo</span>
            </div>
            <button
              type="button"
              onClick={handleAdminBoboLogin}
              disabled={loading}
              className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <span>👑 Injira nka Admin (Kanda Hano Ako Kanya)</span>
            </button>
          </div>

          {/* Quick Demo Options */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              ⚡ Andika cyangwa Hitamo Icyiciro (1-Click)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemo('student')}
                disabled={loading}
                className="p-2 rounded-xl bg-[#122419] hover:bg-[#183223] border border-emerald-800/60 text-center transition-all group"
              >
                <GraduationCap className="w-4 h-4 text-emerald-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-slate-200 block">Umunyeshuri (Student)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemo('professional')}
                disabled={loading}
                className="p-2 rounded-xl bg-[#122419] hover:bg-[#183223] border border-emerald-800/60 text-center transition-all group"
              >
                <Briefcase className="w-4 h-4 text-emerald-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-slate-200 block">Client / Pro</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-emerald-950"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase">
              cyangwa andika imyirondoro
            </span>
            <div className="flex-grow border-t border-emerald-950"></div>
          </div>

          {/* Regular Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email cyangwa Username (urugero: <code className="text-emerald-400">bobo</code>)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bobo cyangwa email yawe"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0c1610] border border-emerald-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  Ijambo ry'Ibanga (Password)
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setShowForgotModal(true);
                      setForgotStep(1);
                    }}
                    className="text-[11px] text-emerald-400 hover:underline font-semibold"
                  >
                    Wibagiwe Password?
                  </button>
                  <span className="text-slate-600 text-[10px]">•</span>
                  <Link
                    to="/forgot-password"
                    className="text-[10px] text-slate-400 hover:text-emerald-300 hover:underline"
                    title="Fungura paji yihariye yo gusubizaho password"
                  >
                    Paji Yihariye
                  </Link>
                </div>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="urugero: bobo"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0c1610] border border-emerald-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <span>{loading ? 'Irimo kwinjira...' : 'Injira (Login)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0c1610] border border-emerald-500/30 p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-emerald-400">
              <KeyRound className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">
                Wibagiwe Password? (Password Reset)
              </h3>
            </div>

            {forgotError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                {forgotError}
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestForgot} className="space-y-4">
                <p className="text-xs text-slate-400">
                  Andika email cyangwa username ukoresha kuri KinyaAI kugira ngo uhabwe uburyo bwo gukora password nshya.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email cyangwa Username
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="urugero: bobo cyangwa email@kinya.rw"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#122218] border border-emerald-900 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Hagarika
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading || !forgotEmail.trim()}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                  >
                    {forgotLoading ? 'Birimo gusuzumwa...' : 'Komeza (Next)'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Code yo gusubiramo yabonetse:</span>
                  </div>
                  <div className="text-lg font-mono font-extrabold text-white tracking-widest pl-5">
                    {resetCodeReceived}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Injiza Code
                  </label>
                  <input
                    type="text"
                    required
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    placeholder={resetCodeReceived}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#122218] border border-emerald-900 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Password Nshya (New Password)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#122218] border border-emerald-900 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Inyuma
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading || !newPassword}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                  >
                    {forgotLoading ? 'Irimo kubika...' : 'Bika Password Nshya'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
