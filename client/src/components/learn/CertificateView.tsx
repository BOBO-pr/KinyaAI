import React, { useRef, useState } from 'react';
import {
  Award,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  Loader2,
  Share2,
  Linkedin,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';
import { CertificateData } from '../../types';
import { printIsolatedCertificate } from '../../utils/printCertificate';

interface CertificateViewProps {
  certificate: CertificateData;
  onClose?: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ certificate }) => {
  const [copiedId, setCopiedId] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const verifyUrl = `${window.location.origin}/verify/${certificate.certificateId}`;

  const handlePrint = () => {
    if (certRef.current) {
      printIsolatedCertificate(
        certRef.current,
        `KinyaAI_Certificate_${certificate.studentRealName.replace(/\s+/g, '_')}_${certificate.courseSlug}`
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
        pixelRatio: 2.5, // 2.5x crisp HD
        backgroundColor: '#06110a',
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `KinyaAI_Certificate_${certificate.studentRealName.replace(/\s+/g, '_')}_${certificate.courseSlug}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading certificate image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(certificate.certificateId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleShareLinkedIn = () => {
    const date = new Date(certificate.issuedAt || Date.now());
    const issueYear = date.getFullYear();
    const issueMonth = date.getMonth() + 1;
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
      certificate.courseTitle
    )}&organizationName=KinyaAI+Academy&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${encodeURIComponent(
      verifyUrl
    )}&certId=${encodeURIComponent(certificate.certificateId)}`;
    window.open(url, '_blank');
  };

  const handleShareWhatsApp = () => {
    const msg = `🎓 Natsindiye Impamyabumenyi yemewe (Official Certificate) muri KinyaAI Academy ku isomo ryitwa "${certificate.courseTitle}" n'amanota ${certificate.score}% (${certificate.grade})!\nReba ubugenzuzi hano: ${verifyUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const formattedDate = new Date(certificate.issuedAt || Date.now()).toLocaleDateString('rw-RW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Action Bar (hidden in print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0c1610] border border-emerald-900/60 shadow-xl print:hidden">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-md">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Impamyabumenyi Yemewe (Verified Course Certificate)
            </h4>
            <p className="text-xs text-slate-400">
              Nimero: <span className="font-mono text-emerald-400 font-bold">{certificate.certificateId}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* LinkedIn Share */}
          <button
            onClick={handleShareLinkedIn}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#0a233a] hover:bg-[#0f3456] border border-sky-500/40 text-xs font-semibold text-sky-300 transition-colors"
            title="Add to LinkedIn Certifications"
          >
            <Linkedin className="w-4 h-4 text-sky-400" />
            <span>LinkedIn</span>
          </button>

          {/* WhatsApp Share */}
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#0a2818] hover:bg-[#0e3b23] border border-emerald-500/40 text-xs font-semibold text-emerald-300 transition-colors"
            title="Share on WhatsApp Status & Groups"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp</span>
          </button>

          {/* Copy ID */}
          <button
            onClick={handleCopyId}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#0f2418] hover:bg-[#143222] border border-emerald-800 text-xs font-semibold text-emerald-300 transition-colors"
          >
            {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedId ? 'Kode Yakopiwe!' : 'Kopera ID'}</span>
          </button>

          {/* Direct HD PNG Image Download Button */}
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0f2818] hover:bg-[#163a23] border border-emerald-500/50 text-emerald-300 font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Gutunganya Ifoto...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Kuramo Ifoto (HD PNG)</span>
              </>
            )}
          </button>

          {/* 1-Page Landscape Print / PDF Button */}
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Gucapa / Kuramo PDF</span>
          </button>
        </div>
      </div>

      {/* Ornate Certificate Canvas */}
      <div
        ref={certRef}
        id="kinya-certificate"
        className="kinya-certificate-sheet relative mx-auto w-full max-w-4xl p-6 sm:p-10 rounded-3xl bg-[#06110a] text-slate-100 shadow-2xl border-4 border-amber-500/80 overflow-hidden print:m-0 print:p-6 print:w-full print:max-w-none print:h-full print:border-4 print:border-amber-400 print:bg-[#06110a] print:text-slate-100 print:shadow-none"
        style={{
          boxShadow: '0 0 60px rgba(245, 158, 11, 0.18), inset 0 0 40px rgba(16, 185, 129, 0.12)',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
      >
        {/* Inner Gold Guilloche Border */}
        <div className="absolute inset-2.5 sm:inset-4 border-2 border-dashed border-amber-400/40 rounded-2xl pointer-events-none" />
        <div className="absolute inset-4 sm:inset-6 border border-emerald-500/30 rounded-xl pointer-events-none" />

        {/* Decorative Corners */}
        <div className="absolute top-5 left-5 w-8 h-8 border-t-4 border-l-4 border-amber-400 pointer-events-none" />
        <div className="absolute top-5 right-5 w-8 h-8 border-t-4 border-r-4 border-amber-400 pointer-events-none" />
        <div className="absolute bottom-5 left-5 w-8 h-8 border-b-4 border-l-4 border-amber-400 pointer-events-none" />
        <div className="absolute bottom-5 right-5 w-8 h-8 border-b-4 border-r-4 border-amber-400 pointer-events-none" />

        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <Award className="w-[380px] h-[380px] text-amber-300" />
        </div>

        <div className="relative z-10 text-center space-y-4 sm:space-y-6">
          {/* Header & Crest */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-4 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs font-black tracking-widest uppercase">
              <Sparkles className="w-3 h-3" />
              <span>KINYA-AI ACADEMY OF EXCELLENCE • RWANDA</span>
              <Sparkles className="w-3 h-3" />
            </div>

            <h1 className="text-xl sm:text-3xl font-serif font-black tracking-wider uppercase bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300 bg-clip-text text-transparent">
              Urupapuro rw'Ishimwe n'Impamyabumenyi
            </h1>
            <div className="text-[11px] sm:text-xs font-medium tracking-widest text-slate-300 uppercase">
              Official Certificate of Academic Achievement & Excellence
            </div>
          </div>

          {/* Presentation Statement */}
          <div className="space-y-1 max-w-xl mx-auto">
            <p className="text-[11px] sm:text-xs italic text-slate-300">
              Iyi mpamyabumenyi irahamya ko uwitwa / This certifies that
            </p>
            {/* Student Real Name */}
            <div className="py-1 border-b-2 border-amber-400/60 max-w-md mx-auto">
              <span className="text-2xl sm:text-4xl font-serif font-bold tracking-wide text-amber-300 drop-shadow-sm">
                {certificate.studentRealName}
              </span>
            </div>
          </div>

          {/* Citation of Course & Achievement */}
          <div className="max-w-2xl mx-auto space-y-1.5 text-xs text-slate-200 leading-relaxed">
            <p className="text-[11px] sm:text-xs">
              Yarangije neza ibyiciro byose by'amasomo, umukoro mugari w'ibibazo 50, ndetse anatsinda ikizamini gikomeye cy'ubumenyi ngiro (20 Hardest Questions Final Exam) n'amanota y'indashyikirwa:
            </p>
            <div className="px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-sm sm:text-base tracking-wide inline-block shadow-sm">
              {certificate.courseTitle}
            </div>
            <div className="text-[10px] text-slate-400 italic">
              {certificate.courseTitleEn}
            </div>
          </div>

          {/* Medallion Badge (Score & Distinction) */}
          <div className="flex items-center justify-center gap-6 py-1">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#08170e] flex flex-col items-center justify-center text-center p-1.5 border border-amber-400">
                <span className="text-[9px] font-black tracking-widest text-amber-400 uppercase">
                  Amanota
                </span>
                <span className="text-lg sm:text-xl font-black text-amber-300">
                  {certificate.score}%
                </span>
                <span className="text-[8px] font-extrabold uppercase text-emerald-400 tracking-wider">
                  {certificate.grade}
                </span>
              </div>
            </div>
          </div>

          {/* Verification & Signatures Bar with Scannable QR Code */}
          <div className="pt-3 border-t border-amber-400/40 grid grid-cols-3 gap-3 items-end text-center">
            {/* Signature 1 */}
            <div className="space-y-0.5">
              <div className="font-serif italic text-amber-300 text-xs sm:text-sm border-b border-slate-700 pb-0.5 max-w-[130px] mx-auto">
                Dr. Jean-Paul Kagabo
              </div>
              <div className="text-[8px] sm:text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                Umuyobozi w'Amasomo (Academic Director)
              </div>
            </div>

            {/* Official Scannable QR Code & Serial Number */}
            <div className="space-y-1 flex flex-col items-center">
              <div className="p-1 rounded-lg bg-white shadow-sm flex items-center justify-center">
                <QRCodeSVG value={verifyUrl} size={42} level="M" />
              </div>
              <div className="text-[8px] font-mono text-emerald-400 uppercase font-bold tracking-widest">
                {certificate.certificateId}
              </div>
              <div className="text-[7px] text-slate-400">
                Itariki: {formattedDate}
              </div>
            </div>

            {/* Signature 2 */}
            <div className="space-y-0.5">
              <div className="font-serif italic text-amber-300 text-xs sm:text-sm border-b border-slate-700 pb-0.5 max-w-[130px] mx-auto">
                Bobo Tuyishime
              </div>
              <div className="text-[8px] sm:text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                Umugenzuzi Mukuru wa AI (Lead AI Examiner)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
