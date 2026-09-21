import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Award,
  RotateCcw,
  Lock,
  Unlock,
  KeyRound,
  FileCheck,
  AlertTriangle,
  Trophy,
  ClipboardList,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { learnAPI } from '../services/api';
import { Course, CourseModule, CertificateData, MasterCertificateData, QuizQuestion } from '../types';
import { useAuth } from '../context/AuthContext';
import { CertificateView } from '../components/learn/CertificateView';
import { MasterCertificateView } from '../components/learn/MasterCertificateView';

export const LearnPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'lessons' | 'assignment' | 'exam' | 'certificate' | 'master-certificate'>('lessons');

  // Master Certificate of All Subjects state
  const [masterCertificateData, setMasterCertificateData] = useState<MasterCertificateData | null>(null);
  const [masterEligible, setMasterEligible] = useState<boolean>(false);
  const [masterTotalCount, setMasterTotalCount] = useState<number>(0);
  const [masterCompletedCount, setMasterCompletedCount] = useState<number>(0);
  const [masterPendingSubjects, setMasterPendingSubjects] = useState<any[]>([]);
  const [masterPassedSubjects, setMasterPassedSubjects] = useState<any[]>([]);
  const [claimingMaster, setClaimingMaster] = useState<boolean>(false);

  // Enrollment state
  const [enrollmentMap, setEnrollmentMap] = useState<Record<string, boolean>>({});
  const [enrollKeyInput, setEnrollKeyInput] = useState('');
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [enrollSuccess, setEnrollSuccess] = useState<string | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  // Lesson module quiz
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // 50-Question Assignment state
  const [assignmentAnswers, setAssignmentAnswers] = useState<Record<number, number>>({});
  const [assignmentCurrentIdx, setAssignmentCurrentIdx] = useState<number>(0);
  const [assignmentSubmitted, setAssignmentSubmitted] = useState<boolean>(false);
  const [assignmentScore, setAssignmentScore] = useState<number | null>(null);
  const [assignmentReview, setAssignmentReview] = useState<any[]>([]);
  const [assignmentLoading, setAssignmentLoading] = useState<boolean>(false);

  // 20 Hardest Questions Exam state
  const [studentRealName, setStudentRealName] = useState<string>('');
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [examCurrentIdx, setExamCurrentIdx] = useState<number>(0);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<number | null>(null);
  const [examPassed, setExamPassed] = useState<boolean>(false);
  const [examMessage, setExamMessage] = useState<string>('');
  const [examReview, setExamReview] = useState<any[]>([]);
  const [examLoading, setExamLoading] = useState<boolean>(false);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);

  useEffect(() => {
    if (user?.name) {
      setStudentRealName(user.name);
    }
  }, [user]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await learnAPI.getCourses();
      if (res.success && res.courses.length > 0) {
        setCourses(res.courses);
        const first = res.courses[0];
        setSelectedCourse(first);
        if (first.modules.length > 0) {
          setActiveModule(first.modules[0]);
        }

        const enrollMap: Record<string, boolean> = {};
        res.courses.forEach((c) => {
          enrollMap[c.slug] = !!c.isEnrolled;
        });
        setEnrollmentMap(enrollMap);
      }

      // Load user progress
      const progRes = await learnAPI.getProgress();
      if (progRes.success && progRes.progress) {
        const completed: string[] = [];
        const enrollMap: Record<string, boolean> = {};

        progRes.progress.forEach((p: any) => {
          if (p.completedModules) {
            completed.push(...p.completedModules);
          }
          if (p.enrolled) {
            enrollMap[p.courseSlug] = true;
          }
          if (p.certificateIssued && p.certificateId) {
            setCertificateData({
              certificateId: p.certificateId,
              studentRealName: p.studentRealName || user?.name || 'KinyaAI Scholar',
              courseSlug: p.courseSlug,
              courseTitle: selectedCourse?.titleKinya || 'Porogaramu ya KinyaAI',
              courseTitleEn: selectedCourse?.titleEn || 'KinyaAI Curriculum',
              score: p.examScore || 100,
              grade: (p.examScore || 100) >= 90 ? 'High Distinction' : 'Distinction',
              issuedAt: p.certificateIssuedAt || new Date().toISOString(),
            });
            setExamPassed(true);
            setExamScore(p.examScore);
            setExamSubmitted(true);
          }
          if (p.assignmentSubmitted) {
            setAssignmentScore(p.assignmentScore);
            setAssignmentSubmitted(true);
          }
        });

        setCompletedModules(completed);
        setEnrollmentMap((prev) => ({ ...prev, ...enrollMap }));
      }

      await loadMasterCertificate();
    } catch (err) {
      console.error('Failed to load courses:', err);
    }
  };

  const loadMasterCertificate = async () => {
    try {
      const res = await learnAPI.getMasterCertificate();
      if (res.success) {
        setMasterEligible(res.eligible);
        setMasterTotalCount(res.totalCount);
        setMasterCompletedCount(res.completedCount);
        setMasterPendingSubjects(res.pendingSubjects || []);
        setMasterPassedSubjects(res.passedSubjects || []);
        if (res.masterCertificate) {
          setMasterCertificateData(res.masterCertificate);
        }
      }
    } catch (err) {
      console.error('Failed to load master certificate:', err);
    }
  };

  const handleClaimMasterCertificate = async () => {
    setClaimingMaster(true);
    try {
      const res = await learnAPI.claimMasterCertificate({
        studentRealName: studentRealName || user?.name || 'Bobo Tuyishime',
      });
      if (res.success && res.masterCertificate) {
        setMasterCertificateData(res.masterCertificate);
        setMasterEligible(true);
        setMasterCompletedCount(res.masterCertificate.totalSubjects);
        setActiveTab('master-certificate');
        confetti({ particleCount: 180, spread: 100, origin: { y: 0.5 } });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gufungura Impamyabumenyi byanze.');
    } finally {
      setClaimingMaster(false);
    }
  };

  const isCurrentCourseEnrolled = selectedCourse ? !!enrollmentMap[selectedCourse.slug] : false;

  const handleEnrollSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedCourse || !enrollKeyInput.trim()) return;

    setEnrollLoading(true);
    setEnrollError(null);
    setEnrollSuccess(null);

    try {
      const res = await learnAPI.enroll({
        courseSlug: selectedCourse.slug,
        enrollmentKey: enrollKeyInput.trim(),
      });

      if (res.success) {
        setEnrollmentMap((prev) => ({ ...prev, [selectedCourse.slug]: true }));
        setEnrollSuccess(res.message);
        setShowEnrollModal(false);
        setEnrollKeyInput('');
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err: any) {
      setEnrollError(
        err.response?.data?.message || 'Enrollment Key ntabwo ihuye. Ongera ugerageze cyangwa ubaze umwarimu.'
      );
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleSelectModule = (module: CourseModule) => {
    setActiveModule(module);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleModuleQuizOption = (questionIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitModuleQuiz = async () => {
    if (!activeModule || !selectedCourse) return;

    let correctCount = 0;
    activeModule.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / activeModule.quiz.length) * 100);
    setQuizScore(calculatedScore);
    setQuizSubmitted(true);

    if (calculatedScore >= 80) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }

    try {
      await learnAPI.submitQuiz({
        courseSlug: selectedCourse.slug,
        moduleId: activeModule.id,
        score: calculatedScore,
      });

      if (!completedModules.includes(activeModule.id)) {
        setCompletedModules((prev) => [...prev, activeModule.id]);
      }
    } catch (err) {
      console.error('Failed to save quiz score:', err);
    }
  };

  // 50-Question Assignment Handlers
  const handleAssignmentOption = (questionIndex: number, optionIndex: number) => {
    if (assignmentSubmitted) return;
    setAssignmentAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitAssignment = async () => {
    if (!selectedCourse) return;

    const totalQuestions = selectedCourse.assignmentQuestions?.length || 50;
    const answeredCount = Object.keys(assignmentAnswers).length;

    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `Wamaze gusubiza ibibazo ${answeredCount} kuri ${totalQuestions}. Urashaka gutanga umukoro n'ubundi?`
      );
      if (!confirmSubmit) return;
    }

    setAssignmentLoading(true);
    try {
      const res = await learnAPI.submitAssignment({
        courseSlug: selectedCourse.slug,
        answers: assignmentAnswers,
      });

      if (res.success) {
        setAssignmentScore(res.score);
        setAssignmentReview(res.review);
        setAssignmentSubmitted(true);
        if (res.score >= 70) {
          confetti({ particleCount: 90, spread: 70 });
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gutanga umukoro byanze. Ongera ugerageze.');
    } finally {
      setAssignmentLoading(false);
    }
  };

  // 20 Hardest Questions Exam Handlers
  const handleExamOption = (questionIndex: number, optionIndex: number) => {
    if (examSubmitted) return;
    setExamAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitExam = async () => {
    if (!selectedCourse) return;
    if (!studentRealName.trim()) {
      alert('Injiza amazina yawe nyakuri (Real Name) azandikwa kuri Certificate.');
      return;
    }

    const answeredCount = Object.keys(examAnswers).length;
    if (answeredCount < 20) {
      const confirmSubmit = window.confirm(
        `Wasubije ibibazo ${answeredCount} kuri 20. Urabyizeye neza ko ushaka gutanga ikizamini cyawe cyo guhabwa Certificate?`
      );
      if (!confirmSubmit) return;
    }

    setExamLoading(true);
    try {
      const res = await learnAPI.submitExam({
        courseSlug: selectedCourse.slug,
        studentRealName: studentRealName.trim(),
        answers: examAnswers,
      });

      if (res.success) {
        setExamScore(res.score);
        setExamPassed(res.passed);
        setExamMessage(res.message);
        setExamReview(res.review);
        setExamSubmitted(true);

        if (res.passed && res.certificate) {
          setCertificateData(res.certificate);
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
          // Automatically switch to Certificate tab
          setTimeout(() => {
            setActiveTab('certificate');
          }, 1500);
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gutanga ikizamini byanze. Ongera ugerageze.');
    } finally {
      setExamLoading(false);
    }
  };

  const handleRetakeExam = () => {
    setExamSubmitted(false);
    setExamAnswers({});
    setExamCurrentIdx(0);
    setExamMessage('');
  };

  // Questions arrays from course or fallbacks
  const assignmentQuestions: QuizQuestion[] = selectedCourse?.assignmentQuestions?.length
    ? selectedCourse.assignmentQuestions
    : [];

  const examQuestions: QuizQuestion[] = selectedCourse?.examQuestions?.length
    ? selectedCourse.examQuestions
    : [];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 print:p-0 print:m-0 print:max-w-none print:w-full print:space-y-0">
      {/* Header */}
      <div className="space-y-2 print:hidden">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-300">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>KinyaAI Academy, Comprehensive Study & Examination Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Amasomo, Umukoro w'Ibibazo 50, Ikizamini cya Leta & Impamyabumenyi
        </h1>
        <p className="text-sm text-slate-400">
          Iyandikishe ukoresheje Enrollment Key, wige amasomo, kora umukoro w'ibibazo 50, unatsinde ikizamini cy'ibibazo 20 bikomeye (&ge; 75%) kugira ngo uhabwe Impamyabumenyi (Official Certificate).
        </p>
      </div>

      {/* Courses tabs bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-emerald-950/80 pb-3 print:hidden">
        {courses.map((c) => {
          const isSelected = selectedCourse?.slug === c.slug;
          const isEnrolled = !!enrollmentMap[c.slug];

          return (
            <button
              key={c.slug}
              onClick={() => {
                setSelectedCourse(c);
                if (c.modules.length > 0) {
                  handleSelectModule(c.modules[0]);
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-[#0c1610] text-slate-400 hover:text-white border border-emerald-950'
              }`}
            >
              {isEnrolled ? (
                <Unlock className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{c.titleKinya}</span>
              {isEnrolled && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  isSelected ? 'bg-slate-950 text-emerald-300' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  Enrolled
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Course Gateway Check: Locked vs Enrolled */}
      {!isCurrentCourseEnrolled ? (
        /* ENROLLMENT GATE: Course is locked until student inputs the key */
        <div className="rounded-3xl glass-panel p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 border-2 border-amber-500/30 print:hidden">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10 animate-bounce">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              🔒 Isomo Rirafunze (Enrollment Key Required)
            </span>
            <h2 className="text-2xl font-bold text-white">
              {selectedCourse?.titleKinya}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Kugira ngo ufungure iri somo, utangire kwiga, ukore umukoro w'ibibazo 50, n'ikizamini cyo guhesha Certificate, ugomba kwiyandikisha ukoresheje **Enrollment Key** yatanzwe n'umwarimu cyangwa ubuyobozi (Admin).
            </p>
          </div>

          {/* Quick Key Hint for Bobo/Testing */}
          <div className="p-3 rounded-xl bg-[#0f2418] border border-emerald-500/30 text-xs text-emerald-300 inline-block">
            💡 Enrollment Key y'Iri Somo: <span className="font-mono font-bold text-amber-300">{selectedCourse?.enrollmentKey || 'KINYA-JS-2026'}</span>
          </div>

          {enrollError && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center justify-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{enrollError}</span>
            </div>
          )}

          {/* Form to submit enrollment key */}
          <form onSubmit={handleEnrollSubmit} className="max-w-md mx-auto space-y-3">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={enrollKeyInput}
                onChange={(e) => setEnrollKeyInput(e.target.value)}
                placeholder="Injiza Enrollment Key hano (urugero: KINYA-JS-2026)"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0c1610] border border-emerald-900 focus:border-amber-400 text-sm font-mono tracking-wider text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={enrollLoading || !enrollKeyInput.trim()}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <Unlock className="w-4 h-4" />
              <span>{enrollLoading ? 'Gufungura isomo...' : 'Fungura Isomo Ubu (Enroll & Unlock)'}</span>
            </button>
          </form>
        </div>
      ) : (
        /* COURSE UNLOCKED: 4 Sub-Tabs */
        <div className="space-y-6 print:space-y-0">
          {/* Sub-Tabs Switcher */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#0c1610] border border-emerald-950 print:hidden">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'lessons'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>1. 📚 Amasomo (Lessons & Quizzes)</span>
            </button>

            <button
              onClick={() => setActiveTab('assignment')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'assignment'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>2. 📝 Umukoro w'Ibibazo 50 (50-Q Assignment)</span>
              {assignmentScore !== null && (
                <span className="ml-1 px-1.5 py-0.2 rounded bg-slate-950 text-emerald-300 text-[10px]">
                  {assignmentScore}%
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('exam')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'exam'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>3. 🏆 Ikizamini cya Leta (20 Hardest Questions)</span>
              {examScore !== null && (
                <span className={`ml-1 px-1.5 py-0.2 rounded text-[10px] ${
                  examPassed ? 'bg-amber-400 text-slate-950 font-black' : 'bg-rose-950 text-rose-300'
                }`}>
                  {examScore}% {examPassed ? '✓ Pass' : '✗ Fair'}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('certificate')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'certificate'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 shadow-md'
                  : certificateData
                  ? 'text-amber-400 hover:text-amber-300'
                  : 'text-slate-500 cursor-not-allowed'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>4. 🎓 Impamyabumenyi (Course Certificate)</span>
              {certificateData && <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />}
            </button>

            <button
              onClick={() => setActiveTab('master-certificate')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'master-certificate'
                  ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-emerald-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : masterCertificateData
                  ? 'bg-amber-950/40 text-amber-300 border border-amber-500/50 hover:bg-amber-900/50'
                  : 'text-amber-400/80 hover:text-amber-300 border border-emerald-950'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>5. 👑 Impamyabumenyi y'Amasomo Yose (Master Diploma)</span>
              {masterCertificateData ? (
                <span className="ml-1 px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[10px] font-black">
                  Mastered
                </span>
              ) : (
                <span className="ml-1 px-1.5 py-0.2 rounded bg-[#09160d] text-slate-400 text-[10px]">
                  {masterCompletedCount}/{masterTotalCount || 3}
                </span>
              )}
            </button>
          </div>

          {/* ============================================================ */}
          {/* TAB 1: AMASOMO & PRACTICE QUIZZES */}
          {/* ============================================================ */}
          {activeTab === 'lessons' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Modules Sidebar */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-5 rounded-2xl glass-card space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Ibyiciro by'Isomo (Modules)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {selectedCourse?.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    {selectedCourse?.modules.map((m, idx) => {
                      const isActive = activeModule?.id === m.id;
                      const isCompleted = completedModules.includes(m.id);

                      return (
                        <div
                          key={m.id}
                          onClick={() => handleSelectModule(m)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isActive
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                              : 'bg-[#0a140e] border-emerald-950 text-slate-400 hover:border-emerald-800'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 truncate">
                            <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-semibold truncate text-slate-200">
                              {m.titleKinya}
                            </span>
                          </div>

                          {isCompleted && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Lesson & Module Quiz Content */}
              <div className="lg:col-span-8 space-y-6">
                {activeModule && (
                  <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
                    <div className="border-b border-emerald-950/80 pb-4 space-y-1">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                        {selectedCourse?.titleEn}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">
                        {activeModule.titleKinya}
                      </h2>
                      <div className="text-xs text-slate-400">
                        {activeModule.titleEn}
                      </div>
                    </div>

                    <div className="text-sm text-slate-200 leading-relaxed space-y-4 whitespace-pre-wrap bg-[#0b1610] p-6 rounded-2xl border border-emerald-900/40">
                      {activeModule.content}
                    </div>

                    {/* Module Knowledge Check */}
                    {activeModule.quiz && activeModule.quiz.length > 0 && (
                      <div className="pt-6 border-t border-emerald-950/80 space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-emerald-400">
                            <HelpCircle className="w-5 h-5" />
                            <h3 className="text-base font-bold text-white">
                              Ikizamini Cy'Iryo Somo (Practice Check)
                            </h3>
                          </div>

                          {quizSubmitted && (
                            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-xs font-bold text-emerald-300">
                              <Award className="w-4 h-4" />
                              <span>Amanota: {quizScore}%</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          {activeModule.quiz.map((q, qIndex) => {
                            const selectedAnswer = quizAnswers[qIndex];
                            return (
                              <div
                                key={qIndex}
                                className="p-4 rounded-2xl bg-[#09120c] border border-emerald-950 space-y-3"
                              >
                                <div className="text-sm font-semibold text-slate-100">
                                  {qIndex + 1}. {q.question}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {q.options.map((opt, optIdx) => {
                                    const isSelected = selectedAnswer === optIdx;
                                    const isCorrect = optIdx === q.correctIndex;

                                    let style = 'bg-[#0e1d13] border-emerald-900 text-slate-300 hover:border-emerald-700';
                                    if (quizSubmitted) {
                                      if (isCorrect) style = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                                      else if (isSelected && !isCorrect) style = 'bg-rose-950 border-rose-500 text-rose-200';
                                    } else if (isSelected) {
                                      style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                                    }

                                    return (
                                      <button
                                        key={optIdx}
                                        onClick={() => handleModuleQuizOption(qIndex, optIdx)}
                                        className={`p-3 rounded-xl border text-left text-xs transition-all ${style}`}
                                      >
                                        <span className="font-bold mr-2 text-slate-400">
                                          {String.fromCharCode(65 + optIdx)}.
                                        </span>
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>

                                {quizSubmitted && (
                                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-slate-300">
                                    💡 <strong>Igisobanuro:</strong> {q.explanation}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {!quizSubmitted && (
                          <button
                            onClick={handleSubmitModuleQuiz}
                            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
                          >
                            Tanga Ibisubizo
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: 50-QUESTION COMPREHENSIVE ASSIGNMENT */}
          {/* ============================================================ */}
          {activeTab === 'assignment' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl glass-panel space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/80 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                      Umukoro Mugari w'Icyiciro (Comprehensive 50-Question Assignment)
                    </span>
                    <h2 className="text-xl font-bold text-white">
                      Ibibazo 50 by'Umwimerere: {selectedCourse?.titleKinya}
                    </h2>
                  </div>

                  {assignmentScore !== null && (
                    <div className="px-4 py-2 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2">
                      <Award className="w-4 h-4" />
                      <span>Amanota: {assignmentScore}%</span>
                    </div>
                  )}
                </div>

                {/* Question numbers grid 1 to 50 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Ikibazo cya <strong>{assignmentCurrentIdx + 1}</strong> kuri {assignmentQuestions.length || 50}
                    </span>
                    <span>
                      Wasubije: {Object.keys(assignmentAnswers).length} / {assignmentQuestions.length || 50}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-[#09120c] border border-emerald-950 max-h-32 overflow-y-auto">
                    {assignmentQuestions.map((_, idx) => {
                      const isCurrent = assignmentCurrentIdx === idx;
                      const isAnswered = assignmentAnswers[idx] !== undefined;

                      return (
                        <button
                          key={idx}
                          onClick={() => setAssignmentCurrentIdx(idx)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-emerald-500 text-slate-950 scale-110 shadow-md'
                              : isAnswered
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                              : 'bg-[#0c1610] text-slate-500 hover:text-slate-300 border border-emerald-950'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Question Display */}
                {assignmentQuestions[assignmentCurrentIdx] && (
                  <div className="p-6 rounded-2xl bg-[#0c1610] border border-emerald-900/60 space-y-4">
                    <div className="text-base font-semibold text-white">
                      <span className="text-emerald-400 font-bold mr-2">
                        {assignmentCurrentIdx + 1}.
                      </span>
                      {assignmentQuestions[assignmentCurrentIdx].question}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {assignmentQuestions[assignmentCurrentIdx].options.map((opt, optIdx) => {
                        const isSelected = assignmentAnswers[assignmentCurrentIdx] === optIdx;
                        const isSubmitted = assignmentSubmitted;
                        const isCorrect = optIdx === assignmentQuestions[assignmentCurrentIdx].correctIndex;

                        let style = 'bg-[#0f1f15] border-emerald-900 hover:border-emerald-700 text-slate-200';
                        if (isSubmitted) {
                          if (isCorrect) style = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                          else if (isSelected && !isCorrect) style = 'bg-rose-950 border-rose-500 text-rose-200';
                        } else if (isSelected) {
                          style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleAssignmentOption(assignmentCurrentIdx, optIdx)}
                            className={`p-3.5 rounded-xl border text-left text-xs transition-all ${style}`}
                          >
                            <span className="font-bold mr-2 text-slate-400">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {assignmentSubmitted && (
                      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-slate-300">
                        💡 <strong>Igisobanuro:</strong> {assignmentQuestions[assignmentCurrentIdx].explanation}
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation & Submit Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      disabled={assignmentCurrentIdx === 0}
                      onClick={() => setAssignmentCurrentIdx((prev) => Math.max(0, prev - 1))}
                      className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-[#0c1610] border border-emerald-900 text-xs text-slate-300 hover:text-white disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Ubanza</span>
                    </button>
                    <button
                      type="button"
                      disabled={assignmentCurrentIdx === (assignmentQuestions.length || 50) - 1}
                      onClick={() => setAssignmentCurrentIdx((prev) => Math.min((assignmentQuestions.length || 50) - 1, prev + 1))}
                      className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-[#0c1610] border border-emerald-900 text-xs text-slate-300 hover:text-white disabled:opacity-40"
                    >
                      <span>Ukurikira</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleSubmitAssignment}
                    disabled={assignmentLoading}
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>{assignmentLoading ? 'Gukosora...' : 'Tanga Umukoro wose (Submit 50 Questions)'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: 20 HARDEST QUESTIONS FINAL CERTIFICATION EXAM */}
          {/* ============================================================ */}
          {activeTab === 'exam' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-6 border border-amber-500/30">
                <div className="border-b border-emerald-950/80 pb-4 space-y-2">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Final Official Certification Examination (20 Hardest Questions)</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Ikizamini Gikomeye cyo Guhesha Impamyabumenyi (Certificate Exam)
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ⚠️ <strong>Amategeko y'Icyemezo:</strong> Ikizamini kigizwe n'ibibazo 20 bikomeye by'ubuhanga. Buri kibazo gifite amanota 5 (Amanota yose: 100).
                    Kugira ngo uhabwe <strong>Impamyabumenyi (Official Certificate)</strong>, ugomba kubona nibura <strong>75% cyangwa hejuru yayo</strong>.
                    Ubonye 74% kumanuka abaye <em>Fair / Ntiyatsinze</em> kandi nta Certificate ahabwa kugeza asubiyemo ikizamini akagitsinda.
                  </p>
                </div>

                {/* Candidate Real Name confirmation input */}
                <div className="p-4 rounded-2xl bg-[#09150d] border border-amber-500/40 space-y-2 max-w-lg">
                  <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                    👤 Amazina Yawe Nyakuri (Real Name on Certificate)
                  </label>
                  <input
                    type="text"
                    value={studentRealName}
                    onChange={(e) => setStudentRealName(e.target.value)}
                    placeholder="urugero: Bobo Tuyishime"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1610] border border-emerald-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-semibold"
                  />
                  <span className="text-[11px] text-slate-400 block">
                    Aya mazina niyo azandikwa kuri Certificate yawe ya KinyaAI mu gihe watsinze &ge; 75%.
                  </span>
                </div>

                {/* Score Alert Banner if submitted */}
                {examSubmitted && (
                  <div
                    className={`p-6 rounded-2xl border text-center space-y-3 ${
                      examPassed
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-600 text-rose-200'
                    }`}
                  >
                    <div className="text-3xl font-black">
                      {examPassed ? '🎉 WATSINZE NEZA!' : '❌ NTABWO WATSINZE (FAIR)'}
                    </div>
                    <div className="text-lg font-bold">
                      Amanota: <span className="underline">{examScore}%</span> (20 Questions)
                    </div>
                    <p className="text-xs max-w-lg mx-auto leading-relaxed">
                      {examMessage}
                    </p>

                    <div className="pt-2 flex justify-center gap-3">
                      {examPassed ? (
                        <button
                          onClick={() => setActiveTab('certificate')}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black text-xs shadow-lg"
                        >
                          🎓 Reba Impamyabumenyi Yawe Ubu (View Certificate)
                        </button>
                      ) : (
                        <button
                          onClick={handleRetakeExam}
                          className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg"
                        >
                          🔄 Subiramo Ikizamini (Retake Exam)
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Question index navigation 1 to 20 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Ikibazo cya <strong>{examCurrentIdx + 1}</strong> kuri {examQuestions.length || 20}
                    </span>
                    <span>
                      Wasubije: {Object.keys(examAnswers).length} / {examQuestions.length || 20}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-[#09120c] border border-emerald-950">
                    {examQuestions.map((_, idx) => {
                      const isCurrent = examCurrentIdx === idx;
                      const isAnswered = examAnswers[idx] !== undefined;

                      return (
                        <button
                          key={idx}
                          onClick={() => setExamCurrentIdx(idx)}
                          className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                            isCurrent
                              ? 'bg-amber-400 text-slate-950 scale-110 shadow-md shadow-amber-400/20'
                              : isAnswered
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                              : 'bg-[#0c1610] text-slate-500 hover:text-slate-300 border border-emerald-950'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Hard Question Display */}
                {examQuestions[examCurrentIdx] && (
                  <div className="p-6 rounded-2xl bg-[#0a180f] border border-amber-500/30 space-y-4">
                    <div className="text-base font-semibold text-white leading-relaxed">
                      <span className="text-amber-400 font-extrabold mr-2">
                        {examCurrentIdx + 1}.
                      </span>
                      {examQuestions[examCurrentIdx].question}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {examQuestions[examCurrentIdx].options.map((opt, optIdx) => {
                        const isSelected = examAnswers[examCurrentIdx] === optIdx;
                        const isSubmitted = examSubmitted;
                        const isCorrect = optIdx === examQuestions[examCurrentIdx].correctIndex;

                        let style = 'bg-[#0c1c11] border-emerald-950 hover:border-amber-500/50 text-slate-200';
                        if (isSubmitted) {
                          if (isCorrect) style = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                          else if (isSelected && !isCorrect) style = 'bg-rose-950 border-rose-500 text-rose-200';
                        } else if (isSelected) {
                          style = 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleExamOption(examCurrentIdx, optIdx)}
                            className={`p-4 rounded-xl border text-left text-xs transition-all leading-relaxed ${style}`}
                          >
                            <span className="font-bold mr-2 text-amber-400">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {examSubmitted && (
                      <div className="p-3.5 rounded-xl bg-[#09150d] border border-emerald-800 text-xs text-slate-300">
                        💡 <strong>Ibisobanuro by'Ubushakashatsi:</strong> {examQuestions[examCurrentIdx].explanation}
                      </div>
                    )}
                  </div>
                )}

                {/* Exam Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      disabled={examCurrentIdx === 0}
                      onClick={() => setExamCurrentIdx((prev) => Math.max(0, prev - 1))}
                      className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-[#0c1610] border border-emerald-900 text-xs text-slate-300 hover:text-white disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Ubanza</span>
                    </button>
                    <button
                      type="button"
                      disabled={examCurrentIdx === (examQuestions.length || 20) - 1}
                      onClick={() => setExamCurrentIdx((prev) => Math.min((examQuestions.length || 20) - 1, prev + 1))}
                      className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-[#0c1610] border border-emerald-900 text-xs text-slate-300 hover:text-white disabled:opacity-40"
                    >
                      <span>Ukurikira</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {!examSubmitted && (
                    <button
                      onClick={handleSubmitExam}
                      disabled={examLoading}
                      className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                    >
                      <Award className="w-4 h-4" />
                      <span>{examLoading ? 'Gukosora Ikizamini...' : 'Tanga Ikizamini cya Leta (Submit 20 Hardest Questions)'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: OFFICIAL CERTIFICATE OF ACHIEVEMENT */}
          {/* ============================================================ */}
          {activeTab === 'certificate' && (
            <div className="space-y-6 print:space-y-0">
              {certificateData ? (
                <CertificateView certificate={certificateData} />
              ) : (
                <div className="rounded-3xl glass-panel p-12 text-center max-w-xl mx-auto space-y-4 border border-amber-500/30">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Nta Mpamyabumenyi (Certificate) Irakorwa
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Kugira ngo uhabwe iyi Certificate yemewe y'icyitegererezo, ugomba gutsinda <strong>Ikizamini Gikomeye cy'Ibibazo 20 (20 Hardest Questions Exam)</strong> ukagira nibura <strong>75% cyangwa hejuru yayo</strong>.
                  </p>
                  <button
                    onClick={() => setActiveTab('exam')}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                  >
                    Kora Ikizamini Ubu (Take Exam Now)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: GRAND MASTER DIPLOMA OF ALL SUBJECTS (IN ONE PAGE) */}
          {/* ============================================================ */}
          {activeTab === 'master-certificate' && (
            <div className="space-y-6 print:space-y-0">
              {masterCertificateData ? (
                <MasterCertificateView masterCertificate={masterCertificateData} />
              ) : (
                <div className="rounded-3xl glass-panel p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 border-2 border-amber-500/40 shadow-2xl">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/15">
                    <Trophy className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                      Grand Master Academic Honors
                    </span>
                    <h2 className="text-2xl font-bold text-white">
                      Impamyabumenyi y'Ikirenga mu Masomo Yose (Master Diploma)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                      Iyi mpamyabumenyi y'ikirenga ihabwa umunyeshuri watsinze <strong>amasomo yose</strong> agize KinyaAI Academy (&ge; 75% kuri buri somo), ikaba iza yanditsweho amasomo yose n'amanota yayo ku rupapuro rumwe (In One Page).
                    </p>
                  </div>

                  {/* Progress tracker */}
                  <div className="p-4 rounded-2xl bg-[#09160d] border border-amber-500/30 text-xs space-y-3 max-w-md mx-auto">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-300">Amasomo Wamaze Gutsinda:</span>
                      <span className="text-amber-400 font-mono text-sm">
                        {masterCompletedCount} / {masterTotalCount || 3}
                      </span>
                    </div>

                    <div className="w-full bg-[#050e08] h-2.5 rounded-full overflow-hidden border border-emerald-950">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.round(((masterCompletedCount) / Math.max(masterTotalCount, 1)) * 100)}%`,
                        }}
                      />
                    </div>

                    {masterPendingSubjects.length > 0 && (
                      <div className="text-left text-[11px] text-slate-400 pt-1 space-y-1">
                        <span className="font-semibold text-slate-300 block">Amasomo asigaye:</span>
                        {masterPendingSubjects.map((s) => (
                          <div key={s.slug} className="flex items-center space-x-1.5 text-amber-300/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>{s.titleKinya}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fast unlock / Instant Test Button */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleClaimMasterCertificate}
                      disabled={claimingMaster}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 mx-auto disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>
                        {claimingMaster
                          ? 'Irimo gutunganya Impamyabumenyi...'
                          : '⚡ Fungura Impamyabumenyi y\'Amasomo Yose Ubu (Instant Master Diploma)'}
                      </span>
                    </button>
                    <p className="text-[11px] text-slate-500">
                      Kanda hano kugira ngo uhite ubona Impamyabumenyi y'Ikirenga mu masomo yose ku rupapuro rumwe (In One Page).
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LearnPage;
