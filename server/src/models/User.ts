import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'general' | 'student' | 'professional' | 'business' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  username?: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string;
  resetCode?: string;
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

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, trim: true, lowercase: true, default: '' },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['general', 'student', 'professional', 'business', 'admin'],
      default: 'general',
    },
    avatarUrl: { type: String, default: '' },
    resetCode: { type: String, default: '' },
    usageCount: {
      chat: { type: Number, default: 0 },
      translations: { type: Number, default: 0 },
      lessons: { type: Number, default: 0 },
      documents: { type: Number, default: 0 },
      tokens: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
