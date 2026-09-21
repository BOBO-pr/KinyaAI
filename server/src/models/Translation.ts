import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITranslation extends Document {
  userId?: Types.ObjectId | string;
  sourceLanguage: 'rw' | 'en';
  targetLanguage: 'rw' | 'en';
  sourceText: string;
  translatedText: string;
  formality?: 'informal' | 'standard' | 'formal';
  notes?: string;
  createdAt: Date;
}

const TranslationSchema = new Schema<ITranslation>(
  {
    userId: { type: Schema.Types.Mixed, default: null, index: true },
    sourceLanguage: { type: String, enum: ['rw', 'en'], required: true },
    targetLanguage: { type: String, enum: ['rw', 'en'], required: true },
    sourceText: { type: String, required: true },
    translatedText: { type: String, required: true },
    formality: { type: String, enum: ['informal', 'standard', 'formal'], default: 'standard' },
    notes: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const TranslationModel = mongoose.model<ITranslation>('Translation', TranslationSchema);
