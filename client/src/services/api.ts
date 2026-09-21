import axios from 'axios';
import {
  User,
  Conversation,
  Message,
  TranslationItem,
  Course,
  DashboardStats,
  UserRole,
  DocumentAnalysisResult,
  CertificateData,
  MasterCertificateData,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kinya_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API
export const authAPI = {
  register: async (data: { name: string; email: string; password: string; role?: UserRole }) => {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/register', data);
    return res.data;
  },
  login: async (data: { email: string; password: string }) => {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/login', data);
    return res.data;
  },
  demoLogin: async (role: UserRole = 'student') => {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/demo-login', { role });
    return res.data;
  },
  getMe: async () => {
    const res = await api.get<{ success: boolean; user: User }>('/auth/me');
    return res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await api.post<{ success: boolean; message: string; resetCode?: string; email?: string }>(
      '/auth/forgot-password',
      { email }
    );
    return res.data;
  },
  resetPassword: async (data: { email: string; newPassword: string }) => {
    const res = await api.post<{ success: boolean; message: string }>('/auth/reset-password', data);
    return res.data;
  },
};

// Chat API
export const chatAPI = {
  sendMessage: async (data: {
    conversationId?: string;
    message: string;
    language?: 'rw' | 'en' | 'mixed';
    systemInstruction?: string;
  }) => {
    const res = await api.post<{
      success: boolean;
      conversationId: string;
      reply: Message;
    }>('/chat/message', data);
    return res.data;
  },
  getConversations: async () => {
    const res = await api.get<{ success: boolean; conversations: Conversation[] }>('/chat/conversations');
    return res.data;
  },
  getMessages: async (conversationId: string) => {
    const res = await api.get<{ success: boolean; messages: Message[] }>(`/chat/conversations/${conversationId}/messages`);
    return res.data;
  },
  renameConversation: async (id: string, title: string) => {
    const res = await api.patch<{ success: boolean; message: string }>(`/chat/conversations/${id}`, { title });
    return res.data;
  },
  deleteConversation: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/chat/conversations/${id}`);
    return res.data;
  },
};

// Translation API
export const translateAPI = {
  translate: async (data: {
    text: string;
    sourceLang: 'rw' | 'en';
    targetLang: 'rw' | 'en';
    formality?: 'informal' | 'standard' | 'formal';
  }) => {
    const res = await api.post<{ success: boolean; translation: TranslationItem; id?: string }>('/translate', data);
    return res.data;
  },
  getHistory: async () => {
    const res = await api.get<{ success: boolean; history: TranslationItem[] }>('/translate/history');
    return res.data;
  },
  clearHistory: async () => {
    const res = await api.delete<{ success: boolean }>('/translate/history');
    return res.data;
  },
};

// Learning Center API
export const learnAPI = {
  getCourses: async () => {
    const res = await api.get<{ success: boolean; courses: Course[] }>('/learn/courses');
    return res.data;
  },
  getCourse: async (slug: string) => {
    const res = await api.get<{ success: boolean; course: Course }>(`/learn/courses/${slug}`);
    return res.data;
  },
  enroll: async (data: { courseSlug: string; enrollmentKey: string }) => {
    const res = await api.post<{ success: boolean; message: string; enrolled: boolean }>('/learn/enroll', data);
    return res.data;
  },
  submitQuiz: async (data: { courseSlug: string; moduleId: string; score: number }) => {
    const res = await api.post<{ success: boolean; progress: any }>('/learn/quiz/submit', data);
    return res.data;
  },
  submitAssignment: async (data: { courseSlug: string; answers: Record<number, number> }) => {
    const res = await api.post<{
      success: boolean;
      score: number;
      correctCount: number;
      totalQuestions: number;
      review: any[];
      message: string;
    }>('/learn/assignment/submit', data);
    return res.data;
  },
  submitExam: async (data: {
    courseSlug: string;
    studentRealName: string;
    answers: Record<number, number>;
  }) => {
    const res = await api.post<{
      success: boolean;
      score: number;
      passed: boolean;
      certificateIssued: boolean;
      certificateId?: string;
      studentRealName?: string;
      correctCount: number;
      totalQuestions: number;
      review: any[];
      message: string;
      certificate?: CertificateData;
    }>('/learn/exam/submit', data);
    return res.data;
  },
  getCertificate: async (certificateId: string) => {
    const res = await api.get<{ success: boolean; certificate: CertificateData }>(`/learn/certificate/${certificateId}`);
    return res.data;
  },
  getMasterCertificate: async () => {
    const res = await api.get<{
      success: boolean;
      eligible: boolean;
      totalCount: number;
      completedCount: number;
      pendingCount: number;
      averageScore: number;
      grade: string;
      studentRealName: string;
      passedSubjects: any[];
      pendingSubjects: any[];
      masterCertificate: MasterCertificateData | null;
    }>('/learn/master-certificate');
    return res.data;
  },
  claimMasterCertificate: async (data?: { studentRealName?: string }) => {
    const res = await api.post<{
      success: boolean;
      message: string;
      masterCertificate: MasterCertificateData;
    }>('/learn/master-certificate/claim', data || {});
    return res.data;
  },
  createCourse: async (data: any) => {
    const res = await api.post<{ success: boolean; course: Course; message: string }>('/learn/courses', data);
    return res.data;
  },
  getProgress: async () => {
    const res = await api.get<{ success: boolean; progress: any[] }>('/learn/progress');
    return res.data;
  },
};

// Document Summarizer API
export const docAPI = {
  summarize: async (data: { title?: string; content: string; language?: 'rw' | 'en' }) => {
    const res = await api.post<{
      success: boolean;
      result: DocumentAnalysisResult;
    }>('/document/summarize', data);
    return res.data;
  },
  upload: async (formData: FormData) => {
    const res = await api.post<{
      success: boolean;
      result: DocumentAnalysisResult;
    }>('/document/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const res = await api.get<{
      success: boolean;
      stats: DashboardStats;
      recentConversations: Conversation[];
      recentTranslations: any[];
      role: UserRole;
    }>('/dashboard/stats');
    return res.data;
  },
};

// Admin API
export const adminAPI = {
  getOverview: async () => {
    const res = await api.get<{
      success: boolean;
      stats: { totalUsers: number; totalConversations: number; totalTranslations: number; totalFeedback: number };
      systemHealth: any;
      users: any[];
      feedback: any[];
    }>('/admin/overview');
    return res.data;
  },
  submitFeedback: async (data: { feature: string; rating: number; comment?: string }) => {
    const res = await api.post<{ success: boolean; feedback: any }>('/admin/feedback', data);
    return res.data;
  },
};

export default api;
