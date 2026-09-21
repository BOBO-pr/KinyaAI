import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(3, 'Email or username is required'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  role: z.enum(['general', 'student', 'professional', 'business', 'admin']).optional(),
});

export const loginSchema = z.object({
  email: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email or username is required'),
});

export const resetPasswordSchema = z.object({
  email: z.string().min(1, 'Email or username is required'),
  newPassword: z.string().min(4, 'New password must be at least 4 characters'),
});

export const chatMessageSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1, 'Message cannot be empty'),
  language: z.enum(['rw', 'en', 'mixed']).optional(),
  systemInstruction: z.string().optional(),
});

export const translateSchema = z.object({
  text: z.string().min(1, 'Source text cannot be empty'),
  sourceLang: z.enum(['rw', 'en']),
  targetLang: z.enum(['rw', 'en']),
  formality: z.enum(['informal', 'standard', 'formal']).optional(),
});

export const feedbackSchema = z.object({
  feature: z.enum(['chat', 'translate', 'learn', 'summarize', 'general']),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});
