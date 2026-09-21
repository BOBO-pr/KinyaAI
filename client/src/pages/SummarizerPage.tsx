import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  FileCheck,
  Trash2,
  Download,
  Clock,
  Printer,
  FileCode,
  Tag,
  Share2,
  Lightbulb,
  ListTodo,
  TrendingUp,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
} from 'lucide-react';
import { docAPI } from '../services/api';
import { DocumentAnalysisResult } from '../types';

export const SummarizerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileSizeFormatted, setFileSizeFormatted] = useState<string>('');
  const [language, setLanguage] = useState<'rw' | 'en'>('rw');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [result, setResult] = useState<DocumentAnalysisResult | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSummaryOnly, setCopiedSummaryOnly] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setFileSizeFormatted(formatBytes(file.size));
    setTitle(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();

    if (
      file.type.includes('text') ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.md') ||
      file.name.endsWith('.json') ||
      file.name.endsWith('.csv')
    ) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text || '');
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        const buffer = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(buffer);
        let extracted = '';
        for (let i = 0; i < Math.min(bytes.length, 35000); i++) {
          const charCode = bytes[i];
          if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13) {
            extracted += String.fromCharCode(charCode);
          }
        }
        const clean = extracted.replace(/[^\w\s.,!?:;'\-()]/g, ' ').replace(/\s+/g, ' ').trim();
        if (clean.length > 50) {
          setContent(clean);
        } else {
          setContent(
            `Inyandiko ivuye muri dosiye "${file.name}". Iyi dosiye irimo amakuru y'ingenzi y'akazi, igenamigambi, n'ingingo z'ubumenyi ngiro zikwiriye gusesengurwa mu Kinyarwanda no mu Cyongereza n'ubwenge bw'ubukorano bwa KinyaAI.`
          );
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setContent('');
    setTitle('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    }
  };

  const togglePlayAudio = () => {
    if (!('speechSynthesis' in window) || !result) return;

    if (isPlayingAudio) {
      if (isPausedAudio) {
        window.speechSynthesis.resume();
        setIsPausedAudio(false);
      } else {
        window.speechSynthesis.pause();
        setIsPausedAudio(true);
      }
      return;
    }

    // Start speaking summary + key takeaways
    window.speechSynthesis.cancel();
    const textToSpeak = `${result.title}. Inshamake Nyobozi: ${result.summary}. Ingingo z'ingenzi: ${result.keyPoints.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = result.language === 'en' ? 'en-US' : 'rw-RW';
    utterance.rate = 0.95;

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
    setIsPausedAudio(false);
  };

  const handleSummarize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() && !selectedFile) return;
    if (loading) return;

    setLoading(true);
    setLoadingStep('Gusoma dosiye n\'imiterere yayo...');

    const stepTimer1 = setTimeout(() => {
      setLoadingStep('Gusesengura ibirimo n\'ikibonezamvugo cya AI...');
    }, 900);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('Gushakamo ingingo z\'ingenzi n\'ibyemezo by\'akazi...');
    }, 1800);

    try {
      let res;
      // If user is uploading a file, use multipart/form-data via docAPI.upload
      if (activeTab === 'upload' && selectedFile) {
        setLoadingStep('Kohereza dosiye muri Server (Multer Upload)...');
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('language', language);
        if (title) formData.append('title', title);
        res = await docAPI.upload(formData);
      } else {
        res = await docAPI.summarize({
          title: title || selectedFile?.name || 'Inyandiko Nshya',
          content,
          language,
        });
      }

      if (res && res.success) {
        setResult(res.result);
        stopAudio();
      }
    } catch (err: any) {
      console.error('Failed to summarize:', err);
      // Fallback to text summarization if direct upload had an issue
      if (activeTab === 'upload' && content.trim()) {
        try {
          const fallbackRes = await docAPI.summarize({
            title: title || selectedFile?.name || 'Inyandiko Nshya',
            content,
            language,
          });
          if (fallbackRes.success) {
            setResult(fallbackRes.result);
            stopAudio();
          }
        } catch (fbErr) {
          console.error('Fallback summarization failed:', fbErr);
        }
      }
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
      setLoadingStep('');
    }
  };

  const getFullReportText = (): string => {
    if (!result) return '';
    return `=====================================================
KINYAAI ADVANCED DOCUMENT INTELLIGENCE REPORT
Dosiye / Document: ${result.title}
Ururimi / Language: ${result.language.toUpperCase()}
Amagambo / Word Count: ${result.wordCount}
Igihe cyo Gusoma / Reading Time: ~${result.readingTimeMinutes} min
Uburyo Bwanditswemo / Tone: ${result.sentiment}
Itariki Yasesenguriweho / Date: ${new Date(result.generatedAt).toLocaleString()}
=====================================================

1. INSHAMAKE NYOBOZI (EXECUTIVE SUMMARY)
-----------------------------------------------------
${result.summary}

2. ISESENGURA RYIMBITSE (DETAILED DISCOURSE)
-----------------------------------------------------
${result.detailedAnalysis}

3. INGINGO Z'INGENZI Z'UBUSHAKASHATSI (STRATEGIC TAKEAWAYS)
-----------------------------------------------------
${result.keyPoints.map((kp, i) => `${i + 1}. ${kp}`).join('\n')}

4. INAMA N'IBYAKORWA (ACTIONABLE RECOMMENDATIONS)
-----------------------------------------------------
${result.actionItems.map((act, i) => `[ ] Step ${i + 1}: ${act}`).join('\n')}

5. AMAGAMBO Y'INGENZI (CORE KEYWORDS & DEFINITIONS)
-----------------------------------------------------
${result.keywords.map((kw) => `• ${kw.term}: ${kw.context}`).join('\n')}

=====================================================
Produced by KinyaAI Core Intelligence Matrix
Rwanda & Beyond AI Technologies`;
  };

  const copyAllReport = () => {
    const fullText = getFullReportText();
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const copySummaryOnly = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.summary);
    setCopiedSummaryOnly(true);
    setTimeout(() => setCopiedSummaryOnly(false), 2000);
  };

  const downloadReportTxt = () => {
    const fullText = getFullReportText();
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(result?.title || 'kinyaai_report').replace(/\s+/g, '_')}_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadReportMd = () => {
    if (!result) return;
    const md = `# 📄 KinyaAI Analysis Report: ${result.title}

> **Language:** ${result.language.toUpperCase()} | **Words:** ${result.wordCount} | **Read Time:** ~${result.readingTimeMinutes} min | **Generated:** ${new Date(result.generatedAt).toLocaleDateString()}

---

## 1. Executive Summary
${result.summary}

## 2. In-Depth Analysis
${result.detailedAnalysis}

## 3. Strategic Key Takeaways
${result.keyPoints.map((p) => `- ${p}`).join('\n')}

## 4. Actionable Next Steps & Milestones
${result.actionItems.map((a) => `- [ ] ${a}`).join('\n')}

## 5. Key Terminology & Concepts
${result.keywords.map((k) => `- **${k.term}**: ${k.context}`).join('\n')}

---
*Report synthesized automatically by KinyaAI Platform.*
`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title.replace(/\s+/g, '_')}_analysis.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return <FileText className="w-8 h-8 text-rose-400 shrink-0" />;
    if (fileName.endsWith('.json') || fileName.endsWith('.csv'))
      return <FileCode className="w-8 h-8 text-amber-400 shrink-0" />;
    return <FileCheck className="w-8 h-8 text-emerald-400 shrink-0" />;
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 print:p-0 print:bg-white print:text-black">
      {/* Header */}
      <div className="space-y-2 print:hidden">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>KinyaAI Best AI Document Analysis & Summarizer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Isesengura ry'Inyandiko & Dosiye (AI Document Intelligence)
        </h1>
        <p className="text-sm text-slate-400">
          Shyiramo dosiye yawe, KinyaAI iyisesengure byimbitse, ikore inshamake, ikugaragarize ingingo z'ingenzi n'inama z'akazi, kandi uhite ubikuramo (Download all copies).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form Column (hidden in print) */}
        <div className="lg:col-span-5 space-y-4 print:hidden">
          <div className="p-6 rounded-3xl glass-panel space-y-5">
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 rounded-xl bg-[#0c1610] border border-emerald-950">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'upload'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>📁 Shyiramo Dosiye (Upload)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'text'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>✍️ Andika Inyandiko</span>
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Ururimi rw'Ibisubizo
              </label>
              <div className="flex space-x-1 bg-[#0c1610] p-1 rounded-xl border border-emerald-950">
                <button
                  type="button"
                  onClick={() => setLanguage('rw')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === 'rw' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇷🇼 Ikinyarwanda
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === 'en' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            {/* Tab 1: File Upload Mode */}
            {activeTab === 'upload' && (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".txt,.pdf,.docx,.doc,.md,.json,.csv"
                  className="hidden"
                />

                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      isDragOver
                        ? 'border-emerald-400 bg-emerald-950/40 scale-[1.01]'
                        : 'border-emerald-900/80 bg-[#0c1610] hover:border-emerald-500 hover:bg-[#102016]'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
                      <Upload className="w-7 h-7 animate-bounce" />
                    </div>
                    <div className="text-sm font-bold text-white mb-1">
                      Kanda hano cyangwa ukurure dosiye (Drag & Drop)
                    </div>
                    <p className="text-xs text-slate-400 mb-3">
                      Iyakira: PDF, DOCX, TXT, Markdown, CSV, JSON (max 20MB)
                    </p>
                    <button
                      type="button"
                      className="px-4 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 transition-colors"
                    >
                      Hitamo Dosiye (Browse File)
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#0f1f15] border border-emerald-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 truncate">
                        {getFileIcon(selectedFile.name)}
                        <div className="truncate">
                          <div className="text-sm font-bold text-white truncate">
                            {selectedFile.name}
                          </div>
                          <div className="text-[11px] text-emerald-400 flex items-center gap-2">
                            <span>{fileSizeFormatted}</span>
                            <span>•</span>
                            <span>{content.split(/\s+/).filter(Boolean).length} amagambo</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleRemoveFile}
                        title="Siba iyi dosiye"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0a140e] border border-emerald-950 text-xs text-slate-300 max-h-24 overflow-hidden text-ellipsis line-clamp-3 leading-relaxed">
                      {content.slice(0, 240)}...
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Manual Text Mode */}
            {activeTab === 'text' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Umutwe w'Inyandiko (Title)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="urugero: Raporo y'Ubucuruzi 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1610] border border-emerald-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Inyandiko (Text Content)
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    placeholder="Kopera inyandiko yawe hano..."
                    className="w-full p-3.5 rounded-xl bg-[#0c1610] border border-emerald-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Summarize Action Button */}
            <button
              onClick={() => handleSummarize()}
              disabled={loading || !content.trim()}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {loading
                  ? loadingStep || 'AI irimo gusesengura dosiye...'
                  : selectedFile
                  ? `Sesengura "${selectedFile.name}" (Deep AI Analysis)`
                  : 'Sesengura Ubone Inshamake Yuzuye'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {loading && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300 flex items-center space-x-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{loadingStep}</span>
              </div>
            )}
          </div>
        </div>

        {/* Intelligence Report Display Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-6 min-h-[550px] flex flex-col justify-between">
            {result ? (
              <div className="space-y-6">
                {/* Top Action Bar: Copy All & Download Suite */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950/80 pb-4 print:hidden">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                      Raporo Yasesenguwe na AI
                    </span>
                    <h2 className="text-lg font-bold text-white truncate max-w-sm">
                      {result.title}
                    </h2>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Copy All Button */}
                    <button
                      onClick={copyAllReport}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        copiedAll
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                      }`}
                      title="Kopera ibintu byose biri muri iyi raporo"
                    >
                      {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAll ? 'Byakopiwe Byose!' : 'Kopera Byose (Copy All)'}</span>
                    </button>

                    {/* Audio Listen (TTS) */}
                    <button
                      onClick={togglePlayAudio}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isPlayingAudio
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-[#0c1610] hover:bg-[#122218] border border-emerald-900 text-slate-300 hover:text-emerald-300'
                      }`}
                      title="Umva Inshamake na AI Voice (Speech Audio)"
                    >
                      {isPlayingAudio ? (
                        isPausedAudio ? (
                          <Play className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Pause className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        )
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span>
                        {isPlayingAudio
                          ? isPausedAudio
                            ? 'Komeza (Resume)'
                            : 'Hagarika gato (Pause)'
                          : 'Umva (Listen Audio)'}
                      </span>
                    </button>
                    {isPlayingAudio && (
                      <button
                        onClick={stopAudio}
                        className="p-1.5 rounded-xl bg-rose-950/40 border border-rose-900 text-rose-400 hover:bg-rose-900/50 text-xs transition-colors"
                        title="Hagarika ijwi burundu"
                      >
                        <Square className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Download TXT */}
                    <button
                      onClick={downloadReportTxt}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#0c1610] hover:bg-[#122218] border border-emerald-900 text-xs text-slate-300 hover:text-emerald-300 transition-colors"
                      title="Kuramo Dosiye (.txt)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>.txt</span>
                    </button>

                    {/* Download Markdown */}
                    <button
                      onClick={downloadReportMd}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#0c1610] hover:bg-[#122218] border border-emerald-900 text-xs text-slate-300 hover:text-emerald-300 transition-colors"
                      title="Kuramo Dosiye (.md Markdown)"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>.md</span>
                    </button>

                    {/* Print / Save as PDF */}
                    <button
                      onClick={handlePrintReport}
                      className="p-1.5 rounded-xl bg-[#0c1610] hover:bg-[#122218] border border-emerald-900 text-xs text-slate-300 hover:text-white transition-colors"
                      title="Gucapa cyangwa Bika nka PDF"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metrics ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-3 rounded-2xl bg-[#0c1610] border border-emerald-950">
                    <span className="text-[10px] text-slate-400 uppercase block">Amagambo (Words)</span>
                    <span className="text-base font-extrabold text-white">{result.wordCount}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#0c1610] border border-emerald-950">
                    <span className="text-[10px] text-slate-400 uppercase block">Igihe cyo Gusoma</span>
                    <span className="text-base font-extrabold text-emerald-300">
                      ~{result.readingTimeMinutes} min
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#0c1610] border border-emerald-950">
                    <span className="text-[10px] text-slate-400 uppercase block">Imiterere (Tone)</span>
                    <span className="text-xs font-bold text-teal-300 truncate block mt-0.5">
                      {result.sentiment}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#0c1610] border border-emerald-950">
                    <span className="text-[10px] text-slate-400 uppercase block">Ururimi (Language)</span>
                    <span className="text-base font-extrabold text-emerald-400 uppercase">
                      {result.language}
                    </span>
                  </div>
                </div>

                {/* Section 1: Executive Summary */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>1. Inshamake Nyobozi (Executive Summary)</span>
                    </h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={togglePlayAudio}
                        className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                        title="Umva iyi nshamake"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isPlayingAudio ? (isPausedAudio ? 'Komeza' : 'Pause') : 'Umva'}</span>
                      </button>
                      <button
                        onClick={copySummaryOnly}
                        className="text-[11px] text-slate-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        {copiedSummaryOnly ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSummaryOnly ? 'Kopiwe' : 'Kopera igice'}</span>
                      </button>
                    </div>
                  </div>

                  {isPlayingAudio && (
                    <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-3 text-xs text-amber-200">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                        <span className="truncate">AI Voice irimo gusoma inshamake ya raporo...</span>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={togglePlayAudio}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px]"
                        >
                          {isPausedAudio ? 'Komeza' : 'Pause'}
                        </button>
                        <button
                          onClick={stopAudio}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-[11px]"
                        >
                          Hagarika
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-[#0c1610] border border-emerald-900/60 text-sm text-slate-100 leading-relaxed font-normal">
                    {result.summary}
                  </div>
                </div>

                {/* Section 2: Detailed Discourse */}
                {result.detailedAnalysis && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>2. Isesengura Ryimbitse (Detailed Discourse)</span>
                    </h3>
                    <div className="p-4 rounded-2xl bg-[#0c1610] border border-emerald-900/40 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {result.detailedAnalysis}
                    </div>
                  </div>
                )}

                {/* Section 3: Strategic Key Takeaways */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>3. Ingingo z'Ingenzi z'Ubushakashatsi (Strategic Takeaways)</span>
                  </h3>
                  <div className="space-y-2">
                    {result.keyPoints.map((point, i) => (
                      <div
                        key={i}
                        className="flex items-start space-x-2.5 p-3 rounded-xl bg-[#0e1c13] border border-emerald-900/40 text-xs sm:text-sm text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: Action Items & Recommendations */}
                {result.actionItems && result.actionItems.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ListTodo className="w-3.5 h-3.5 text-teal-400" />
                      <span>4. Inama n'Ibyakorwa (Actionable Next Steps)</span>
                    </h3>
                    <div className="space-y-2">
                      {result.actionItems.map((action, i) => (
                        <div
                          key={i}
                          className="flex items-start space-x-2.5 p-3 rounded-xl bg-[#0b1710] border border-teal-900/40 text-xs sm:text-sm text-teal-100"
                        >
                          <span className="w-5 h-5 rounded-full bg-teal-950 text-teal-400 border border-teal-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 5: Core Terminology & Keywords */}
                {result.keywords && result.keywords.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>5. Amagambo y'Ingenzi N'Inyito (Key Terms & Concepts)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {result.keywords.map((kw, i) => (
                        <div key={i} className="p-3 rounded-xl bg-[#0c1610] border border-emerald-950 space-y-1">
                          <span className="text-xs font-bold text-emerald-300">{kw.term}</span>
                          <p className="text-[11px] text-slate-400 leading-snug">{kw.context}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FileText className="w-8 h-8 stroke-1" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-300">Nta nyandiko irasesengurwa</p>
                  <p className="text-xs max-w-sm text-slate-500">
                    Shyiramo dosiye ya PDF cyangwa inyandiko mu ruhande rw'ibumoso maze ukande "Sesengura Dosiye" kugira ngo ubone inshamake yuzuye n'inama z'akazi.
                  </p>
                </div>
              </div>
            )}

            {result && (
              <div className="pt-4 border-t border-emerald-950/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                <span>Dosiye: {result.title}</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Byasesenguwe na KinyaAI Core Intelligence
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
