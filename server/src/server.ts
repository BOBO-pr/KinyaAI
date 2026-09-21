import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB, { isConnectedToMongo } from './config/db';
import { errorHandler } from './middleware/role';
import { apiLimiter } from './middleware/rateLimit';

// Routes
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import translateRoutes from './routes/translateRoutes';
import learnRoutes from './routes/learnRoutes';
import documentRoutes from './routes/documentRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import adminRoutes from './routes/adminRoutes';
import paymentRoutes from './routes/paymentRoutes';
import cultureRoutes from './routes/cultureRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiting
app.use('/api/', apiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'KinyaAI Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: isConnectedToMongo ? 'connected' : 'in-memory-fallback',
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/learn', learnRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/culture', cultureRoutes);

// Centralized error handling
app.use(errorHandler);

import { ensureAdminExists } from './controllers/authController';

// Start server
const startServer = async () => {
  await connectDB();
  await ensureAdminExists();

  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 KinyaAI API Server running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=========================================`);
  });
};

startServer();

export default app;
