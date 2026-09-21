import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { TranslationModel } from '../models/Translation';
import { UserModel } from '../models/User';
import { memoryStore, StoredTranslation } from '../config/inMemoryStore';
import { isConnectedToMongo } from '../config/db';
import { AIService } from '../services/aiService';
import { translateSchema } from '../validators';

export const translateText = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = translateSchema.safeParse(req.body);
    if (!validated.success) {
      res.status(400).json({ success: false, errors: validated.error.flatten().fieldErrors });
      return;
    }

    const { text, sourceLang, targetLang, formality = 'standard' } = validated.data;
    const userId = req.user?.id;

    const result = await AIService.translate(text, sourceLang, targetLang, formality);

    // Persist translation record if user is authenticated or guest
    if (isConnectedToMongo) {
      const record = await TranslationModel.create({
        userId: userId || null,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        sourceText: text,
        translatedText: result.translatedText,
        formality,
        notes: result.grammarNotes,
      });

      if (userId) {
        await UserModel.findByIdAndUpdate(userId, {
          $inc: { 'usageCount.translations': 1, 'usageCount.tokens': result.tokensProcessed },
        });
      }

      res.json({ success: true, translation: result, id: record._id });
      return;
    }

    // In-memory fallback
    const memRecord: StoredTranslation = {
      _id: `trans_${Date.now()}`,
      userId: userId || undefined,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      sourceText: text,
      translatedText: result.translatedText,
      formality,
      notes: result.grammarNotes,
      createdAt: new Date(),
    };
    memoryStore.translations.unshift(memRecord);

    if (userId) {
      const u = memoryStore.users.find((x) => x._id === userId);
      if (u) {
        u.usageCount.translations += 1;
        u.usageCount.tokens += result.tokensProcessed;
      }
    }

    res.json({ success: true, translation: result, id: memRecord._id });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Translation failed' });
  }
};

export const getTranslationHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.json({ success: true, history: [] });
      return;
    }

    if (isConnectedToMongo) {
      const history = await TranslationModel.find({ userId }).sort({ createdAt: -1 }).limit(30);
      res.json({ success: true, history });
      return;
    }

    const history = memoryStore.translations
      .filter((t) => t.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 30);

    res.json({ success: true, history });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const clearTranslationHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.json({ success: true });
      return;
    }

    if (isConnectedToMongo) {
      await TranslationModel.deleteMany({ userId });
    } else {
      memoryStore.translations = memoryStore.translations.filter((t) => t.userId !== userId);
    }

    res.json({ success: true, message: 'Translation history cleared' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
