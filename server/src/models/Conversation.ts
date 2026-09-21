import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IConversation extends Document {
  userId: Types.ObjectId | string;
  title: string;
  language: 'rw' | 'en' | 'mixed';
  systemPrompt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    title: { type: String, required: true, default: 'Ikiganiro Gishya' },
    language: { type: String, enum: ['rw', 'en', 'mixed'], default: 'rw' },
    systemPrompt: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ConversationModel = mongoose.model<IConversation>('Conversation', ConversationSchema);
