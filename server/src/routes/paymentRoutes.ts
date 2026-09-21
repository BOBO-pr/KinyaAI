import { Router } from 'express';
import { initiatePayment, verifyPayment, getPackages } from '../controllers/paymentController';
import { authenticateJWT, optionalJWT } from '../middleware/auth';

const router = Router();

// Publicly viewable packages
router.get('/packages', optionalJWT, getPackages);

// Mobile Money Operations
router.post('/momo/initiate', authenticateJWT, initiatePayment);
router.post('/momo/verify', authenticateJWT, verifyPayment);

export default router;
