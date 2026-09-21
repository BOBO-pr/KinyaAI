import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, CheckCircle2 } from 'lucide-react';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if app is already installed / standalone mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsStandalone(true);
      return;
    }

    // Check if user is on iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Listen for Chrome / Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosModal(true);
      return;
    }

    if (!deferredPrompt) {
      // If browser hasn't fired beforeinstallprompt yet, give instructions
      alert('Kugira ngo ushyire KinyaAI muri telefoni:\n1. Kanda ku bumenyetso bwa menu y\'umusembuzi (3 dots ⋮ muri Chrome)\n2. Hitamo "Add to Home screen" cyangwa "Install app"');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsStandalone(true);
    }
  };

  // If already installed or dismissed, don't show the prompt banner
  if (isStandalone || dismissed) {
    return null;
  }

  return (
    <>
      {/* Floating or Embedded Install Trigger Banner */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#0c2317] to-amber-950/60 border border-emerald-500/40 text-slate-100 shadow-xl animate-in fade-in duration-300 print:hidden">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/25 border border-emerald-400 text-emerald-300 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Shyira KinyaAI muri Telefoni</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950 text-[9px] font-black uppercase">
                PWA App
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Yikoreshe nk'application ya Android cyangwa iPhone idasaba Play Store.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
            title="Funga"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Instructions Modal */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#09150d] border-2 border-emerald-500/50 p-6 shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Gushyira KinyaAI kuri iPhone</h4>
              </div>
              <button
                onClick={() => setShowIosModal(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-[#0e2417] border border-emerald-800 flex items-start space-x-3">
                <Share className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Intambwe ya 1:</strong>
                  Kanda kuri button yo gusangiza (Share icon) hasi muri Safari.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0e2417] border border-emerald-800 flex items-start space-x-3">
                <PlusSquare className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Intambwe ya 2:</strong>
                  Zamura gato hanyuma ukande <strong>"Add to Home Screen" (+)</strong>.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0e2417] border border-emerald-800 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Intambwe ya 3:</strong>
                  Kanda <strong>"Add"</strong> hejuru iburyo. KinyaAI izahita iza muri telefone yawe!
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Nabyumvise (Got it)
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PwaInstallPrompt;
