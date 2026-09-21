import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel, IUser } from '../models/User';
import { memoryStore } from '../config/inMemoryStore';
import { isConnectedToMongo } from '../config/db';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const authenticateJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'kinyaai_super_secret_jwt_key_development_2026';

  try {
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string; name: string };
    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    return;
  }
};

export const optionalJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'kinyaai_super_secret_jwt_key_development_2026';
  try {
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string; name: string };
    req.user = decoded;
  } catch (e) {
    // Continue anonymously
  }
  next();
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Uburenganzira burabujijwe (Access forbidden).' });
      return;
    }
    next();
  };
};
