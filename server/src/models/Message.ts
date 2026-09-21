import mongoose, { Schema } from 'mongoose';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface IMessage {
  _id?: any;
  conversationId: any;
  role: MessageRole;
  content: string;
  language?: string;
  aiModel: string;
  tokens?: number;
  feedback?: 'like' | 'dislike' | null;
  createdAt?: Date;
}

const MessageSchema = new Schema(
  {
    conversationId: { type: Schema.Types.Mixed, required: true, index: true },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    language: { type: String, default: 'rw' },
    aiModel: { type: String, default: 'kinyaai-core-v1' },
    tokens: { type: Number, default: 0 },
    feedback: { type: String, enum: ['like', 'dislike', null], default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const MessageModel = mongoose.model<any>('Message', MessageSchema);
