// Resilient in-memory store for KinyaAI development / offline mode
export interface StoredUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'general' | 'student' | 'professional' | 'business' | 'admin';
  avatarUrl?: string;
  usageCount: {
    chat: number;
    translations: number;
    lessons: number;
    documents: number;
    tokens: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredConversation {
  _id: string;
  userId: string;
  title: string;
  language: 'rw' | 'en' | 'mixed';
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredMessage {
  _id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  language?: string;
  model: string;
  tokens: number;
  createdAt: Date;
}

export interface StoredTranslation {
  _id: string;
  userId?: string;
  sourceLanguage: 'rw' | 'en';
  targetLanguage: 'rw' | 'en';
  sourceText: string;
  translatedText: string;
  formality?: 'informal' | 'standard' | 'formal';
  notes?: string;
  createdAt: Date;
}

export interface StoredProgress {
  _id: string;
  userId: string;
  courseSlug: string;
  enrolled: boolean;
  enrolledAt?: Date;
  completedModules: string[];
  quizScores: Record<string, number>;
  assignmentScore?: number;
  assignmentSubmitted?: boolean;
  examScore?: number;
  examSubmitted?: boolean;
  certificateIssued?: boolean;
  certificateId?: string;
  studentRealName?: string;
  certificateIssuedAt?: Date;
  updatedAt: Date;
}

export interface StoredFeedback {
  _id: string;
  userId?: string;
  feature: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

class InMemoryStore {
  users: StoredUser[] = [];
  conversations: StoredConversation[] = [];
  messages: StoredMessage[] = [];
  translations: StoredTranslation[] = [];
  progress: StoredProgress[] = [];
  feedbacks: StoredFeedback[] = [];

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    // Seed an admin user and demo student (password: 'Password123!')
    // We will hash passwords when users register or log in, or default demo password
  }
}

export const memoryStore = new InMemoryStore();
