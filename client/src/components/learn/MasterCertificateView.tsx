import React, { useRef, useState } from 'react';
import {
  Award,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Trophy,
  Download,
  Loader2,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { MasterCertificateData } from '../../types';
import { printIsolatedCertificate } from '../../utils/printCertificate';

interface MasterCertificateViewProps {
  masterCertificate: MasterCertificateData;
  onClose?: () => void;
}

export const MasterCertificateView: React.FC<MasterCertificateViewProps> = ({ masterCertificate }) => {
  const [copiedId, setCopiedId] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (certRef.current) {
      printIsolatedCertificate(
        certRef.current,
        `KinyaAI_Master_Diploma_${masterCertificate.studentRealName.replace(/\s+/g, '_')}`
      );
    } else {
      window.print();
    }
  };

  const handleDownloadImage = async () => {
    if (!certRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(certRef.current, {
        quality: 1,
        pixelRatio: 2.5, // 2.5x resolution for crisp, professional HD image
        backgroundColor: '#051108',
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `KinyaAI_Master_Diploma_${masterCertificate.studentRealName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading certificate image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(masterCertificate.certificateId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const formattedDate = new Date(masterCertificate.issuedAt || Date.now()).toLocaleDateString('rw-RW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls (Strictly hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-amber-950/60 via-[#14281a] to-emerald-950/60 border border-amber-500/50 shadow-xl print:hidden">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/25 border border-amber-400 text-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Trophy className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-extrabold text-white">
                Impamyabumenyi y'Ikirenga mu Masomo Yose (Master Diploma of All Subjects)
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-black text-amber-300 uppercase tracking-widest">
                All Subjects Certified
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Uyu munyeshuri yatsinze neza amasomo yose agize KinyaAI Academy n'impuzandengo ya{' '}
              <strong className="text-amber-300 font-bold">{masterCertificate.averageScore}%</strong>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyId}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-[#0a180e] hover:bg-[#0f2416] border border-amber-500/30 text-xs font-semibold text-amber-300 transition-colors"
          >
            {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedId ? 'Kode Yakopiwe!' : 'Kopera Kode (Master ID)'}</span>
          </button>

          {/* Direct HD PNG Image Download Button */}
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#0f2818] hover:bg-[#163a23] border border-emerald-500/50 text-emerald-300 font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Gutunganya Ifoto...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Kuramo Ifoto (Download HD PNG)</span>
              </>
            )}
          </button>

          {/* 1-Page Landscape Print / PDF Button */}
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Gucapa / Kuramo PDF (Print 1-Page Master Diploma)</span>
          </button>
        </div>
      </div>

      {/* SINGLE-PAGE MASTER DIPLOMA CANVAS */}
      <div
        ref={certRef}
        id="kinya-master-certificate"
        className="kinya-certificate-sheet relative mx-auto w-full max-w-5xl rounded-3xl bg-[#051108] text-slate-100 shadow-2xl border-4 border-amber-400/90 p-5 sm:p-8 overflow-hidden print:m-0 print:p-5 print:w-full print:max-w-none print:h-full print:border-4 print:border-amber-400 print:bg-[#051108] print:text-slate-100 print:shadow-none"
        style={{
          boxShadow: '0 0 80px rgba(245, 158, 11, 0.2), inset 0 0 50px rgba(16, 185, 129, 0.15)',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
      >
        {/* Double Guilloche Inner Borders */}
        <div className="absolute inset-2 sm:inset-3 border-2 border-dashed border-amber-400/50 rounded-2xl pointer-events-none" />
        <div className="absolute inset-3 sm:inset-5 border border-emerald-500/40 rounded-xl pointer-events-none" />

        {/* Ornate Corner Accents */}
        <div className="absolute top-4 left-4 w-9 h-9 border-t-4 border-l-4 border-amber-400 pointer-events-none" />
        <div className="absolute top-4 right-4 w-9 h-9 border-t-4 border-r-4 border-amber-400 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-9 h-9 border-b-4 border-l-4 border-amber-400 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-9 h-9 border-b-4 border-r-4 border-amber-400 pointer-events-none" />

        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <Trophy className="w-[450px] h-[450px] text-amber-300" />
        </div>

        <div className="relative z-10 text-center space-y-4 sm:space-y-5">
          {/* Top Crest Ribbon */}
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-4 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] sm:text-[11px] font-black tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>REPUBLIC OF RWANDA • KINYAAI ACADEMY OF ARTIFICIAL INTELLIGENCE & LINGUISTICS</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>

            <h1 className="text-xl sm:text-3xl font-serif font-black tracking-wider uppercase bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300 bg-clip-text text-transparent">
              Urupapuro rw'Ikirenga mu Masomo Yose
            </h1>
            <div className="text-[11px] sm:text-xs font-semibold tracking-widest text-slate-300 uppercase">
              Grand Master Diploma of Comprehensive Academic Excellence
            </div>
          </div>

          {/* Awarded to Citation */}
          <div className="space-y-1 max-w-2xl mx-auto">
            <p className="text-[11px] italic text-slate-300">
              Iyi mpamyabumenyi y'ikirenga irahamya ko uwitwa / This Master Diploma is proudly conferred upon
            </p>

            {/* Student Real Name Highlight */}
            <div className="py-1 border-b-2 border-amber-400/70 max-w-md mx-auto">
              <span className="text-2xl sm:text-4xl font-serif font-bold tracking-wide text-amber-300 drop-shadow">
                {masterCertificate.studentRealName}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 pt-0.5 max-w-xl mx-auto leading-relaxed">
              Yarangije neza amasomo yose, imikoro y'ibibazo 50, ndetse anatsinda ibizamini byose bikomeye by'umwimerere (All 20-Hardest Certification Exams Passed) n'amanota y'indashyikirwa:
            </p>
          </div>

          {/* ALL SUBJECTS TRANSCRIPT SHOWCASE (IN ONE PAGE) */}
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left">
              {masterCertificate.subjects.map((sub, idx) => (
                <div
                  key={sub.slug || idx}
                  className="p-2.5 rounded-2xl bg-[#091a0f] border border-amber-500/30 flex items-center justify-between gap-2 shadow-sm"
                >
                  <div className="truncate">
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate text-white">{sub.titleKinya}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 truncate">
                      {sub.titleEn}
                    </div>
                  </div>
                  <div className="px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs shrink-0">
                    {sub.score}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cumulative GPA / Distinction Medallion */}
          <div className="flex items-center justify-center gap-3 py-0.5">
            <div className="px-5 py-1.5 rounded-2xl bg-[#0b2013] border-2 border-amber-400/80 shadow-lg flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center font-black text-sm">
                ★
              </div>
              <div className="text-left">
                <span className="text-[8px] text-slate-400 uppercase tracking-widest block">
                  Impuzandengo y'Amanota Yose (Cumulative Average)
                </span>
                <span className="text-lg font-black text-amber-300">
                  {masterCertificate.averageScore}%
                </span>
                <span className="text-[10px] font-bold text-emerald-400 ml-2 uppercase tracking-wide">
                  {masterCertificate.grade}
                </span>
              </div>
            </div>
          </div>

          {/* Institutional Signatures & Master Verification Bar */}
          <div className="pt-3 border-t border-amber-400/40 grid grid-cols-3 gap-2 items-end text-center">
            {/* Signature 1 */}
            <div className="space-y-0.5">
              <div className="font-serif italic text-amber-300 text-sm sm:text-base border-b border-slate-700/80 pb-0.5 max-w-[125px] mx-auto">
                Dr. Jean-Paul Kagabo
              </div>
              <div className="text-[8px] sm:text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                Umuyobozi w'Amasomo (Academic Dean)
              </div>
            </div>

            {/* Grand Master Seal & Serial Number */}
            <div className="space-y-0.5 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-amber-200 text-slate-950 flex items-center justify-center shadow-lg font-black text-xs">
                <ShieldCheck className="w-5 h-5 text-slate-950" />
              </div>
              <div className="text-[8px] font-mono text-amber-300 uppercase font-black tracking-widest">
                {masterCertificate.certificateId}
              </div>
              <div className="text-[7px] text-slate-400">
                Itariki: {formattedDate}
              </div>
            </div>

            {/* Signature 2 */}
            <div className="space-y-0.5">
              <div className="font-serif italic text-amber-300 text-sm sm:text-base border-b border-slate-700/80 pb-0.5 max-w-[125px] mx-auto">
                Hon. Bobo Tuyishime
              </div>
              <div className="text-[8px] sm:text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                Chancellor & Head of Academy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterCertificateView;
