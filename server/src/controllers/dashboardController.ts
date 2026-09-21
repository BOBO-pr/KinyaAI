import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/User';
import { ConversationModel } from '../models/Conversation';
import { TranslationModel } from '../models/Translation';
import { ProgressModel } from '../models/Course';
import { memoryStore } from '../config/inMemoryStore';
import { isConnectedToMongo } from '../config/db';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo_student_id';

    if (isConnectedToMongo) {
      const user = await UserModel.findById(userId);
      const conversationsCount = await ConversationModel.countDocuments({ userId });
      const translationsCount = await TranslationModel.countDocuments({ userId });
      const recentConversations = await ConversationModel.find({ userId })
        .sort({ updatedAt: -1 })
        .limit(5);
      const recentTranslations = await TranslationModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5);
      const progressDocs = await ProgressModel.find({ userId });
      const completedModulesCount = progressDocs.reduce((acc, curr) => acc + curr.completedModules.length, 0);

      res.json({
        success: true,
        stats: {
          chats: conversationsCount || user?.usageCount.chat || 0,
          translations: translationsCount || user?.usageCount.translations || 0,
          lessonsCompleted: completedModulesCount || user?.usageCount.lessons || 0,
          documentsSummarized: user?.usageCount.documents || 0,
          tokensUsed: user?.usageCount.tokens || 1450,
          tokensRemaining: Math.max(0, 50000 - (user?.usageCount.tokens || 1450)),
        },
        recentConversations,
        recentTranslations,
        role: user?.role || req.user?.role || 'student',
      });
      return;
    }

    // In-memory fallback
    const u = memoryStore.users.find((x) => x._id === userId);
    const userConvs = memoryStore.conversations.filter((c) => c.userId === userId);
    const userTrans = memoryStore.translations.filter((t) => t.userId === userId);
    const userProgress = memoryStore.progress.filter((p) => p.userId === userId);
    const completedModules = userProgress.reduce((acc, curr) => acc + curr.completedModules.length, 0);

    res.json({
      success: true,
      stats: {
        chats: userConvs.length || u?.usageCount.chat || 8,
        translations: userTrans.length || u?.usageCount.translations || 14,
        lessonsCompleted: completedModules || u?.usageCount.lessons || 3,
        documentsSummarized: u?.usageCount.documents || 1,
        tokensUsed: u?.usageCount.tokens || 1250,
        tokensRemaining: Math.max(0, 50000 - (u?.usageCount.tokens || 1250)),
      },
      recentConversations: userConvs.slice(0, 5),
      recentTranslations: userTrans.slice(0, 5),
      role: u?.role || req.user?.role || 'student',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
