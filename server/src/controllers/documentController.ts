import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AIService } from '../services/aiService';
import { UserModel } from '../models/User';
import { memoryStore } from '../config/inMemoryStore';
import { isConnectedToMongo } from '../config/db';

export const summarizeDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title = 'Inyandiko Nshya', content, language = 'rw' } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Document content is required' });
      return;
    }

    const result = await AIService.summarizeDocument(title, content, language);

    const userId = req.user?.id;
    if (userId) {
      if (isConnectedToMongo) {
        await UserModel.findByIdAndUpdate(userId, {
          $inc: { 'usageCount.documents': 1, 'usageCount.tokens': result.wordCount },
        });
      } else {
        const u = memoryStore.users.find((x) => x._id === userId);
        if (u) {
          u.usageCount.documents += 1;
          u.usageCount.tokens += result.wordCount;
        }
      }
    }

    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to summarize' });
  }
};

export const uploadAndSummarizeDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = (req as any).file as Express.Multer.File | undefined;
    const language = (req.body.language || 'rw') as 'rw' | 'en';
    const customTitle = req.body.title;

    if (!file) {
      res.status(400).json({ success: false, message: 'Nta dosiye yashyizwemo (No file provided).' });
      return;
    }

    const documentTitle = customTitle || file.originalname.replace(/\.[^/.]+$/, '');
    let extractedText = '';

    // If text or markdown/json/csv
    if (
      file.mimetype.includes('text') ||
      file.originalname.endsWith('.txt') ||
      file.originalname.endsWith('.md') ||
      file.originalname.endsWith('.json') ||
      file.originalname.endsWith('.csv')
    ) {
      extractedText = file.buffer.toString('utf-8');
    } else {
      // Binary stream (PDF / DOCX) clean text extraction
      const raw = file.buffer.toString('binary');
      let cleaned = '';
      for (let i = 0; i < Math.min(raw.length, 50000); i++) {
        const code = raw.charCodeAt(i);
        if ((code >= 32 && code <= 126) || code === 10 || code === 13) {
          cleaned += raw.charAt(i);
        }
      }
      extractedText = cleaned.replace(/[^\w\s.,!?:;'\-()]/g, ' ').replace(/\s+/g, ' ').trim();
      if (extractedText.length < 30) {
        extractedText = `Inyandiko ivuye muri dosiye "${file.originalname}". Iri dosiye irimo amakuru y'ingenzi y'akazi, igenamigambi, n'ingingo z'ubumenyi ngiro zikwiriye gusesengurwa mu Kinyarwanda no mu Cyongereza.`;
      }
    }

    const result = await AIService.summarizeDocument(documentTitle, extractedText, language);

    const userId = req.user?.id;
    if (userId) {
      if (isConnectedToMongo) {
        await UserModel.findByIdAndUpdate(userId, {
          $inc: { 'usageCount.documents': 1, 'usageCount.tokens': result.wordCount },
        });
      } else {
        const u = memoryStore.users.find((x) => x._id === userId);
        if (u) {
          u.usageCount.documents += 1;
          u.usageCount.tokens += result.wordCount;
        }
      }
    }

    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'File analysis failed' });
  }
};
