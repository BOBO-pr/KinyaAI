export type UserRole = 'general' | 'student' | 'professional' | 'business' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  usageCount: {
    chat: number;
    translations: number;
    lessons: number;
    documents: number;
    tokens: number;
  };
}

export interface Conversation {
  _id: string;
  title: string;
  language: 'rw' | 'en' | 'mixed';
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id?: string;
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  aiModel?: string;
  tokens?: number;
  createdAt?: string;
}

export interface TranslationItem {
  _id?: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: 'rw' | 'en';
  targetLanguage: 'rw' | 'en';
  formality?: 'informal' | 'standard' | 'formal';
  confidence?: number;
  grammarNotes?: string;
  alternativeTranslations?: string[];
  tokensProcessed?: number;
  createdAt?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseModule {
  id: string;
  titleKinya: string;
  titleEn: string;
  summary: string;
  content: string;
  quiz: QuizQuestion[];
}

export interface Course {
  _id?: string;
  slug: string;
  category: 'programming' | 'language' | 'business' | 'stem';
  titleKinya: string;
  titleEn: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  enrollmentKey?: string;
  hasEnrollmentKey?: boolean;
  isEnrolled?: boolean;
  totalModules?: number;
  assignmentQuestionsCount?: number;
  examQuestionsCount?: number;
  modules: CourseModule[];
  assignmentQuestions?: QuizQuestion[];
  examQuestions?: QuizQuestion[];
}

export interface CertificateData {
  certificateId: string;
  studentRealName: string;
  courseSlug: string;
  courseTitle: string;
  courseTitleEn: string;
  score: number;
  grade: string;
  issuedAt: string;
}

export interface MasterCertificateSubject {
  slug: string;
  titleKinya: string;
  titleEn: string;
  category: string;
  score: number;
  certificateId?: string;
  completedAt?: string;
}

export interface MasterCertificateData {
  certificateId: string;
  studentRealName: string;
  subjects: MasterCertificateSubject[];
  totalSubjects: number;
  averageScore: number;
  grade: string;
  issuedAt: string;
}

export interface UserProgress {
  courseSlug: string;
  enrolled?: boolean;
  enrolledAt?: string;
  completedModules: string[];
  quizScores: Record<string, number>;
  assignmentScore?: number;
  assignmentSubmitted?: boolean;
  examScore?: number;
  examSubmitted?: boolean;
  certificateIssued?: boolean;
  certificateId?: string;
  studentRealName?: string;
  certificateIssuedAt?: string;
}

export interface DashboardStats {
  chats: number;
  translations: number;
  lessonsCompleted: number;
  documentsSummarized: number;
  tokensUsed: number;
  tokensRemaining: number;
}

export interface DocumentKeyword {
  term: string;
  context: string;
}

export interface DocumentAnalysisResult {
  title: string;
  summary: string;
  detailedAnalysis: string;
  keyPoints: string[];
  actionItems: string[];
  sentiment: string;
  readingTimeMinutes: number;
  topics: string[];
  keywords: DocumentKeyword[];
  wordCount: number;
  characterCount: number;
  language: 'rw' | 'en';
  generatedAt: string;
}
