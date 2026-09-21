import { Router } from 'express';
import {
  getCourses,
  getCourseBySlug,
  enrollCourse,
  submitQuiz,
  submitAssignment,
  submitExam,
  getCertificateById,
  getMasterCertificate,
  claimMasterCertificate,
  adminCreateCourse,
  getUserProgress,
} from '../controllers/learnController';
import { authenticateJWT, optionalJWT, requireRole } from '../middleware/auth';

const router = Router();

// Public / Authenticated Course Discovery
router.get('/courses', optionalJWT, getCourses);
router.get('/courses/:slug', optionalJWT, getCourseBySlug);

// Student Enrollment Gate
router.post('/enroll', authenticateJWT, enrollCourse);

// Learning & Evaluations
router.post('/quiz/submit', authenticateJWT, submitQuiz);
router.post('/assignment/submit', authenticateJWT, submitAssignment);
router.post('/exam/submit', authenticateJWT, submitExam);
router.get('/progress', authenticateJWT, getUserProgress);

// Master Certificate of All Subjects
router.get('/master-certificate', authenticateJWT, getMasterCertificate);
router.post('/master-certificate/claim', authenticateJWT, claimMasterCertificate);

// Certificate Verification & Public Retrieval
router.get('/certificate/:certificateId', getCertificateById);

// Admin Subject & Questions Management
router.post('/courses', authenticateJWT, requireRole(['admin']), adminCreateCourse);

export default router;
