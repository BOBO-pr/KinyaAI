import { Router } from 'express';
import {
  translateText,
  getTranslationHistory,
  clearTranslationHistory,
} from '../controllers/translateController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Optional auth for translation so visitors can test immediately
const optionalAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticateJWT(req, res, next);
  }
  next();
};

router.post('/', optionalAuth, translateText);
router.get('/history', authenticateJWT, getTranslationHistory);
router.delete('/history', authenticateJWT, clearTranslationHistory);

export default router;
