import mongoose, { Schema } from 'mongoose';

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ICourseModule {
  id: string;
  titleKinya: string;
  titleEn: string;
  summary: string;
  content: string;
  quiz: IQuizQuestion[];
}

export interface ICourse {
  _id?: any;
  slug: string;
  category: 'programming' | 'language' | 'business' | 'stem';
  titleKinya: string;
  titleEn: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  enrollmentKey: string;
  modules: ICourseModule[];
  assignmentQuestions: IQuizQuestion[];
  examQuestions: IQuizQuestion[];
  createdAt?: Date;
}

const QuizQuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    explanation: { type: String, default: '' },
  },
  { _id: false }
);

const CourseSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    category: { type: String, enum: ['programming', 'language', 'business', 'stem'], required: true },
    titleKinya: { type: String, required: true },
    titleEn: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    enrollmentKey: { type: String, required: true, default: 'KINYA2026' },
    modules: [
      {
        id: String,
        titleKinya: String,
        titleEn: String,
        summary: String,
        content: String,
        quiz: [QuizQuestionSchema],
      },
    ],
    assignmentQuestions: [QuizQuestionSchema],
    examQuestions: [QuizQuestionSchema],
  },
  { timestamps: true }
);

export const CourseModel = mongoose.model<any>('Course', CourseSchema);

export interface IProgress {
  _id?: any;
  userId: any;
  courseSlug: string;
  enrolled: boolean;
  enrolledAt?: Date;
  completedModules: string[];
  quizScores: any;
  assignmentScore?: number;
  assignmentSubmitted?: boolean;
  examScore?: number;
  examSubmitted?: boolean;
  certificateIssued?: boolean;
  certificateId?: string;
  studentRealName?: string;
  certificateIssuedAt?: Date;
  updatedAt?: Date;
}

const ProgressSchema = new Schema(
  {
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    courseSlug: { type: String, required: true },
    enrolled: { type: Boolean, default: false },
    enrolledAt: { type: Date },
    completedModules: [{ type: String }],
    quizScores: { type: Map, of: Number, default: {} },
    assignmentScore: { type: Number },
    assignmentSubmitted: { type: Boolean, default: false },
    examScore: { type: Number },
    examSubmitted: { type: Boolean, default: false },
    certificateIssued: { type: Boolean, default: false },
    certificateId: { type: String },
    studentRealName: { type: String },
    certificateIssuedAt: { type: Date },
  },
  { timestamps: true }
);

export const ProgressModel = mongoose.model<any>('Progress', ProgressSchema);

export interface IMasterCertificate {
  _id?: any;
  certificateId: string;
  userId: any;
  studentRealName: string;
  subjects: Array<{
    slug: string;
    titleKinya: string;
    titleEn: string;
    category: string;
    score: number;
    certificateId: string;
    completedAt: string;
  }>;
  totalSubjects: number;
  averageScore: number;
  grade: string;
  issuedAt: Date;
}

const MasterCertificateSchema = new Schema(
  {
    certificateId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    studentRealName: { type: String, required: true },
    subjects: [
      {
        slug: String,
        titleKinya: String,
        titleEn: String,
        category: String,
        score: Number,
        certificateId: String,
        completedAt: String,
      },
    ],
    totalSubjects: { type: Number, required: true },
    averageScore: { type: Number, required: true },
    grade: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const MasterCertificateModel = mongoose.model<any>('MasterCertificate', MasterCertificateSchema);
