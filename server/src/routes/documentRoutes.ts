import { Router } from 'express';
import multer from 'multer';
import { summarizeDocument, uploadAndSummarizeDocument } from '../controllers/documentController';
import { authenticateJWT } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimit';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

router.post('/summarize', aiLimiter, authenticateJWT, summarizeDocument);
router.post('/upload', aiLimiter, authenticateJWT, upload.single('file'), uploadAndSummarizeDocument);

export default router;
