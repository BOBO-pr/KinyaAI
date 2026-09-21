import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  Printer,
  Calendar,
  Search,
  ExternalLink,
  BookOpen,
  Trophy,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface CertificateVerificationResult {
  certificateId: string;
  studentRealName: string;
  courseTitle?: string;
  courseTitleEn?: string;
  score?: number;
  grade: string;
  issuedAt: string;
  totalSubjects?: number;
  averageScore?: number;
  subjects?: Array<{
    titleKinya: string;
    score: number;
  }>;
}

export const PublicCertificateVerifyPage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const [searchId, setSearchId] = useState(certificateId || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CertificateVerificationResult | null>(null);
  const [isMaster, setIsMaster] = useState(false);

  const fetchCertificate = async (idToFetch: string) => {
    if (!idToFetch.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/learn/certificate/${encodeURIComponent(idToFetch.trim())}`);
      if (res.data.success) {
        setResult(res.data.certificate);
        setIsMaster(!!res.data.isMaster);
      } else {
        setError(res.data.message || 'Nta mpamyabumenyi yabonetse.');
        setResult(null);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Nta mpamyabumenyi ifite iyi nimero yabonetse muri system ya KinyaAI. Reba neza nimero wanditse.'
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certificateId) {
      fetchCertificate(certificateId);
    } else {
      setLoading(false);
    }
  }, [certificateId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      fetchCertificate(searchId);
    }
  };

  const formattedDate = result?.issuedAt
    ? new Date(result.issuedAt).toLocaleDateString('rw-RW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const verificationUrl = window.location.href;

  return (
    <div className="min-h-screen bg-[#070c09] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      {/* Public Top Navigation Bar */}
      <header className="h-16 px-4 sm:px-8 border-b border-emerald-950/70 bg-[#09130d]/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Kinya<span className="text-emerald-400">AI</span>
          </span>
          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 ml-2">
            Official Verification Portal
          </span>
        </Link>

        <div className="flex items-center space-x-3">
          <Link
            to="/login"
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all"
          >
            Kwinjira (Login)
          </Link>
          <Link
            to="/app/learn"
            className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition-all"
          >
            Kwiga Amasomo (Academy)
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Verification Search Banner */}
        <div className="text-center space-y-3 pt-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-bold text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Kugenzura Impamyabumenyi Yemewe (Verify Credentials)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Ubugenzuzi bw'Impamyabumenyi za KinyaAI
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Injiza nimero ya Certificate (ID) yanditseho kugira ngo ugenzure niba ari umwimerere, wemeze amazina y'umunyeshuri, n'amanota yatsindiyeho.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto flex items-center gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="urugero: KY-CERT-2026-XXXXXX cyangwa KY-MASTER-..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c1610] border border-emerald-900 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              Genyura (Verify)
            </button>
          </form>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="p-12 text-center space-y-3 glass-panel rounded-3xl border border-emerald-950">
            <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Turimo kugenzura mu bubiko bw'impamyabumenyi za KinyaAI...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-8 rounded-3xl bg-rose-950/40 border border-rose-600/60 text-center space-y-3 max-w-xl mx-auto shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-rose-200">Impamyabumenyi Ntiyabonetse</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{error}</p>
          </div>
        )}

        {/* VERIFIED SUCCESS CARD */}
        {result && !loading && (
          <div className="rounded-3xl bg-[#06110a] border-2 border-amber-400/80 p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
            {/* Background Seal Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Verification Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold uppercase tracking-wider">
                      ✓ YEMEWE N'UMWIMERERE (AUTHENTIC)
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white pt-1">
                    Iyi Mpamyabumenyi Yemejwe na KinyaAI Academy
                  </h2>
                </div>
              </div>

              {/* QR Code */}
              <div className="p-2 rounded-xl bg-white flex items-center justify-center shadow-md">
                <QRCodeSVG value={verificationUrl} size={64} level="M" />
              </div>
            </div>

            {/* Student & Credential Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Amazina y'Umunyeshuri (Student Name)
                  </span>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-300 pt-0.5">
                    {result.studentRealName}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isMaster ? "Ubwoko bw'Impamyabumenyi (Diploma)" : "Isomo Ryatsinzwe (Course Title)"}
                  </span>
                  <div className="text-base font-bold text-white pt-0.5">
                    {isMaster
                      ? "Impamyabumenyi y'Ikirenga mu Masomo Yose (Master Diploma of All Subjects)"
                      : result.courseTitle}
                  </div>
                  {result.courseTitleEn && (
                    <div className="text-xs text-slate-400 italic">{result.courseTitleEn}</div>
                  )}
                </div>

                <div className="flex items-center space-x-6 pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Amanota (Score)
                    </span>
                    <span className="text-2xl font-black text-amber-300">
                      {isMaster ? result.averageScore : result.score}%
                    </span>
                  </div>
                  <div className="border-l border-emerald-950 pl-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Urwego (Honors Distinction)
                    </span>
                    <span className="text-sm font-bold text-emerald-400">
                      {result.grade}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata & Institution Seals */}
              <div className="space-y-4 p-5 rounded-2xl bg-[#091a0f] border border-emerald-950/80">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Nimero y'Impamyabumenyi (Serial ID)
                  </span>
                  <div className="font-mono text-xs text-amber-300 font-black tracking-wider select-all">
                    {result.certificateId}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Itariki Yatangiweho (Issue Date)
                  </span>
                  <div className="text-xs text-slate-300 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Urwego Rutanga Impamyabumenyi (Issuer)
                  </span>
                  <div className="text-xs text-slate-200 font-semibold">
                    KinyaAI Academy of Artificial Intelligence & Linguistics, Rwanda
                  </div>
                </div>

                <div className="pt-2">
                  <div className="p-3 rounded-xl bg-[#06140b] border border-amber-500/30 text-[11px] text-slate-300 leading-relaxed">
                    🛡️ <strong>Umutekano:</strong> Iyi mpamyabumenyi yanditse mu buryo bw'ikoranabuhanga muri database ya KinyaAI. Ihamya ko uyu munyeshuri yatsinze ikizamini cy'ibibazo 20 bikomeye (&ge; 75%).
                  </div>
                </div>
              </div>
            </div>

            {/* If Master Diploma: Show Passed Subjects */}
            {isMaster && result.subjects && result.subjects.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Amasomo Yose Yatsinzwe Muri Iyi Mpamyabumenyi:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {result.subjects.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#0b2013] border border-amber-500/30 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-1.5 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-white truncate">{s.titleKinya}</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black text-[11px] shrink-0">
                        {s.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Public Footer */}
      <footer className="py-6 border-t border-emerald-950/70 text-center text-xs text-slate-500">
        <p>© 2026 KinyaAI Academy. All rights reserved. Republic of Rwanda.</p>
      </footer>
    </div>
  );
};

export default PublicCertificateVerifyPage;
