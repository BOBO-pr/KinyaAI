import React, { useState } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  Phone,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface MomoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (tokensAdded: number) => void;
}

interface PackageOption {
  id: string;
  nameKinya: string;
  tokens: number;
  amountRwf: number;
  popular?: boolean;
}

const PACKAGES: PackageOption[] = [
  {
    id: 'starter',
    nameKinya: 'Intangiriro (Starter)',
    tokens: 30000,
    amountRwf: 1500,
  },
  {
    id: 'scholar',
    nameKinya: 'Umunyeshuri w\'Imena (Scholar Pro)',
    tokens: 120000,
    amountRwf: 3500,
    popular: true,
  },
  {
    id: 'unlimited',
    nameKinya: 'Inzobere / VIP (Master VIP)',
    tokens: 500000,
    amountRwf: 8000,
  },
];

export const MomoPaymentModal: React.FC<MomoPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [provider, setProvider] = useState<'mtn' | 'airtel'>('mtn');
  const [selectedPkg, setSelectedPkg] = useState<string>('scholar');
  const [phoneNumber, setPhoneNumber] = useState('0788123456');
  const [step, setStep] = useState<'form' | 'push' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionData, setTransactionData] = useState<any>(null);

  if (!isOpen) return null;

  const pkg = PACKAGES.find((p) => p.id === selectedPkg) || PACKAGES[1];

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('kinya_token');
      const res = await axios.post(
        'http://localhost:5000/api/payment/momo/initiate',
        {
          phoneNumber,
          provider,
          packageId: selectedPkg,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.data.success) {
        setTransactionData(res.data);
        setStep('push');
      } else {
        setError(res.data.message || 'Habaye ikibazo mu kwishyura.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Habaye ikibazo. Reba neza nimero ya telefoni (078... / 079... / 072... / 073...).'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPush = async () => {
    if (!transactionData?.transactionId) return;
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('kinya_token');
      const res = await axios.post(
        'http://localhost:5000/api/payment/momo/verify',
        {
          transactionId: transactionData.transactionId,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.data.success) {
        setStep('success');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        if (onSuccess) {
          onSuccess(res.data.tokensAdded || pkg.tokens);
        }
      } else {
        setError(res.data.message || 'Kwemezwa ntikwakunze.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ikosa mu kwemeza payment.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('form');
    setError(null);
    setTransactionData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#09150d] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-emerald-950/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Kugura Tokens kuri Mobile Money
              </h3>
              <p className="text-xs text-slate-400">MTN MoMo (*182#) & Airtel Money Rwanda</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-emerald-950/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: PACKAGE & PHONE NUMBER SELECTION */}
        {step === 'form' && (
          <form onSubmit={handleInitiate} className="space-y-5">
            {/* Provider Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Hitamo Uburyo bwo Kwishyura (Network)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setProvider('mtn');
                    if (phoneNumber.startsWith('072') || phoneNumber.startsWith('073')) {
                      setPhoneNumber('0788123456');
                    }
                  }}
                  className={`p-3 rounded-2xl border flex items-center justify-center space-x-2.5 transition-all ${
                    provider === 'mtn'
                      ? 'bg-[#ffcc00] text-slate-950 border-[#ffcc00] font-black shadow-lg shadow-yellow-500/20'
                      : 'bg-[#0a180e] text-slate-400 border-emerald-950 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-black">MTN MoMo (*182#)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProvider('airtel');
                    if (phoneNumber.startsWith('078') || phoneNumber.startsWith('079')) {
                      setPhoneNumber('0722123456');
                    }
                  }}
                  className={`p-3 rounded-2xl border flex items-center justify-center space-x-2.5 transition-all ${
                    provider === 'airtel'
                      ? 'bg-[#e60000] text-white border-[#e60000] font-black shadow-lg shadow-red-500/20'
                      : 'bg-[#0a180e] text-slate-400 border-emerald-950 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-black">Airtel Money (*182#)</span>
                </button>
              </div>
            </div>

            {/* Packages Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Hitamo Umubare wa Tokens (Package)
              </label>
              <div className="space-y-2">
                {PACKAGES.map((p) => {
                  const isSelected = selectedPkg === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPkg(p.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-400 shadow-md shadow-emerald-500/15'
                          : 'bg-[#0a180e] border-emerald-950/80 hover:border-emerald-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                              : 'border-slate-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white">{p.nameKinya}</span>
                            {p.popular && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[9px] font-black text-amber-300 uppercase">
                                Icyamamare
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-emerald-400 font-semibold">
                            +{p.tokens.toLocaleString()} Tokens
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-white">
                          {p.amountRwf.toLocaleString()} RWF
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Nimero ya Telefoni ({provider.toUpperCase()})
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={provider === 'mtn' ? '0788123456 cyangwa 079...' : '0722123456 cyangwa 073...'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c1a10] border border-emerald-900 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono font-bold"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-400 block">
                Icyifuzo cyo kwishyura (USSD Prompt) kizahita cyoherezwa kuri iyi nimero.
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-600/60 text-xs text-rose-200 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !phoneNumber.trim()}
              className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center space-x-2 shadow-lg ${
                provider === 'mtn'
                  ? 'bg-[#ffcc00] hover:bg-[#ffdb33] text-slate-950 shadow-yellow-500/20'
                  : 'bg-[#e60000] hover:bg-[#ff1a1a] text-white shadow-red-500/20'
              } disabled:opacity-50 cursor-pointer`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gusaba Kwishyura...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>
                    Ishyura {pkg.amountRwf.toLocaleString()} RWF kuri {provider.toUpperCase()} MoMo
                  </span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: USSD PUSH CONFIRMATION PROMPT */}
        {step === 'push' && transactionData && (
          <div className="space-y-6 text-center py-2">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 animate-pulse">
              <Phone className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                Icyifuzo Cyoherejwe kuri Telefoni
              </span>
              <h3 className="text-xl font-bold text-white">
                Reba kuri Telefoni Yawe ({transactionData.phoneNumber})
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Icyifuzo cyo kwishyura <strong>{transactionData.amountRwf.toLocaleString()} RWF</strong> cyoherejwe kuri <strong>{transactionData.phoneNumber}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0b2012] border border-amber-500/40 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Ref ID:</span>
                <span className="font-mono text-amber-300 font-bold">{transactionData.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Umubare wa Tokens:</span>
                <span className="text-emerald-400 font-bold">+{transactionData.package?.tokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Network USSD:</span>
                <span className="text-white font-bold">{transactionData.ussdPushPrompt}</span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-600 text-xs text-rose-200">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={handleConfirmPush}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-black text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Kugenzura Kwishyura...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Nemeje PIN / Emeza Kwishyura Ubu</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setStep('form')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Subira inyuma / Hindura nimero
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS STATE */}
        {step === 'success' && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Amafaranga Yakiriwe Neza!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Watsindiye kwakira <strong>+{pkg.tokens.toLocaleString()} Tokens</strong> kuri konti yawe ya KinyaAI. Ushobora gukomeza gukoresha AI, kwiga amasomo, no gukora ibizamini.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#091f13] border border-emerald-500/40 text-xs text-emerald-300 font-bold">
              ✓ Konti yawe yahise ivugururwa (Tokens Added Instantly)
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              Funga no Gukomeza Gukoresha KinyaAI
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MomoPaymentModal;
