import { Router } from 'express';
import { getAdminOverview, submitFeedback } from '../controllers/adminController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = Router();

router.get('/overview', authenticateJWT, requireRole(['admin']), getAdminOverview);
router.post('/feedback', authenticateJWT, submitFeedback);

export default router;
