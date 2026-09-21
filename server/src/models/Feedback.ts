import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IFeedback extends Document {
  userId?: Types.ObjectId | string;
  feature: 'chat' | 'translate' | 'learn' | 'summarize' | 'general';
  rating: number; // 1 - 5
  comment: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    userId: { type: Schema.Types.Mixed, default: null },
    feature: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const FeedbackModel = mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export interface IUsageRecord extends Document {
  userId?: Types.ObjectId | string;
  endpoint: string;
  feature: string;
  tokensUsed: number;
  durationMs: number;
  createdAt: Date;
}

const UsageRecordSchema = new Schema<IUsageRecord>(
  {
    userId: { type: Schema.Types.Mixed, default: null, index: true },
    endpoint: { type: String, required: true },
    feature: { type: String, required: true },
    tokensUsed: { type: Number, default: 0 },
    durationMs: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const UsageRecordModel = mongoose.model<IUsageRecord>('UsageRecord', UsageRecordSchema);
