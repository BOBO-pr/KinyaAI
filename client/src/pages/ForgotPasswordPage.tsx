import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import { authAPI } from '../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>('');

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email.trim());
      if (res.success) {
        setGeneratedCode(res.resetCode || '123456');
        setCode(res.resetCode || '');
        setStep(2);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Nta konti ibonetse ifite iyi email. Reba neza cyangwa ukore indi nshya.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setError('Ijambobanga rigomba kugira byibuze inyuguti 4.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Amagambobanga ntabwo ahuye. Reba neza!');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await authAPI.resetPassword({
        email: email.trim(),
        newPassword,
      });
      if (res.success) {
        setStep(3);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Guhindura ijambobanga byanze. Ongera ugerageze.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070c09] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
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
        <h2 className="text-2xl font-extrabold text-white">Wibagiwe Ijambobanga?</h2>
        <p className="text-xs text-slate-400">
          Gusubiza no gukosora ijambobanga rya konti yawe ya KinyaAI mu buryo bworoshye.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Enter email */}
          {step === 1 && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email cyangwa Izina rya Konti (Username)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="urugero: bobo cyangwa izina@email.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c1610] border border-emerald-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Tugiye kuguha Kode y'imibare 6 (Verification Code) yo gukoresha uhindura password.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <span>{loading ? 'Gushaka konti...' : 'Ohereza Kode yo Gusubiza'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Enter code and new password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Notice with auto-generated code */}
              <div className="p-3.5 rounded-2xl bg-[#0f2418] border border-emerald-500/30 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <span>Kode yo Guhindura Password (OTP):</span>
                </div>
                <div className="text-xl font-mono font-black text-emerald-400 tracking-widest pl-6">
                  {generatedCode}
                </div>
                <p className="text-[10px] text-slate-400 pl-6">
                  Iyi kode yashyizwemo mu buryo bwikora. Komeza uhitemo password nshya.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Kode y'Imibare 6 (Reset Code)
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c1610] border border-emerald-900 text-sm font-mono tracking-widest text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Ijambobanga Rishya (New Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c1610] border border-emerald-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Subiramo Ijambobanga (Confirm Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c1610] border border-emerald-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-emerald-900 hover:border-emerald-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Gusubira Inyuma
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Guhindura...' : 'Bika Password Nshya'}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 3 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  Ijambobanga Ryahinduwe Neza!
                </h3>
                <p className="text-xs text-slate-300">
                  Konti yawe ya KinyaAI iriteguye. Ubu ushobora kwinjira ukoresheje password yawe nshya.
                </p>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>Injira muri Konti Ubu (Login Now)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Back to Login & Register links */}
          <div className="pt-4 border-t border-emerald-950/80 flex items-center justify-between text-xs text-slate-400">
            <Link
              to="/login"
              className="inline-flex items-center space-x-1 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Gusubira Kwinjira</span>
            </Link>
            <Link
              to="/register"
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Kwiyandikisha Gushya
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
