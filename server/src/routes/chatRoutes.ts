import { Router } from 'express';
import {
  sendMessage,
  getConversations,
  getConversationMessages,
  renameConversation,
  deleteConversation,
} from '../controllers/chatController';
import { authenticateJWT } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimit';

const router = Router();

// Chat is accessible with JWT or guest fallback
router.post('/message', aiLimiter, authenticateJWT, sendMessage);
router.get('/conversations', authenticateJWT, getConversations);
router.get('/conversations/:id/messages', authenticateJWT, getConversationMessages);
router.patch('/conversations/:id', authenticateJWT, renameConversation);
router.delete('/conversations/:id', authenticateJWT, deleteConversation);

export default router;
