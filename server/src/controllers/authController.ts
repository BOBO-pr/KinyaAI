import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, IUser } from '../models/User';
import { memoryStore, StoredUser } from '../config/inMemoryStore';
import { isConnectedToMongo } from '../config/db';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators';
import { AuthRequest } from '../middleware/auth';

const generateToken = (id: string, email: string, role: string, name: string): string => {
  const secret = process.env.JWT_SECRET || 'kinyaai_super_secret_jwt_key_development_2026';
  return jwt.sign({ id, email, role, name }, secret, { expiresIn: '7d' });
};

// Seed or ensure Admin Bobo exists
export const ensureAdminExists = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('bobo', salt);

    if (isConnectedToMongo) {
      const existing = await UserModel.findOne({
        $or: [{ email: 'bobo@kinya.ai' }, { email: 'bobo' }, { username: 'bobo' }],
      });

      if (!existing) {
        await UserModel.create({
          name: 'Bobo Admin',
          email: 'bobo@kinya.ai',
          username: 'bobo',
          passwordHash,
          role: 'admin',
          usageCount: { chat: 42, translations: 89, lessons: 12, documents: 5, tokens: 18400 },
        });
        console.log('[Auth] Admin account (bobo / bobo) seeded in MongoDB ✅');
      } else {
        // Ensure role is admin and password is bobo
        existing.role = 'admin';
        existing.passwordHash = passwordHash;
        existing.username = 'bobo';
        await existing.save();
        console.log('[Auth] Admin account (bobo / bobo) verified in MongoDB ✅');
      }
    } else {
      const existing = memoryStore.users.find(
        (u) => u.email === 'bobo@kinya.ai' || u.email === 'bobo' || (u as any).username === 'bobo'
      );
      if (!existing) {
        memoryStore.users.push({
          _id: 'admin_bobo_id',
          name: 'Bobo Admin',
          email: 'bobo@kinya.ai',
          passwordHash,
          role: 'admin',
          usageCount: { chat: 42, translations: 89, lessons: 12, documents: 5, tokens: 18400 },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log('[Auth] Admin account (bobo / bobo) seeded in memoryStore ✅');
      }
    }
  } catch (err: any) {
    console.warn('[Auth] Note seeding admin:', err.message);
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = registerSchema.safeParse(req.body);
    if (!validated.success) {
      res.status(400).json({ success: false, errors: validated.error.flatten().fieldErrors });
      return;
    }

    let { name, email, password, role = 'general' } = validated.data;
    const cleanIdentifier = email.trim().toLowerCase();
    // Normalize email if user just entered a username
    const normalizedEmail = cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier}@kinya.ai`;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (isConnectedToMongo) {
      const existing = await UserModel.findOne({
        $or: [{ email: normalizedEmail }, { username: cleanIdentifier }],
      });

      if (existing) {
        res.status(400).json({ success: false, message: 'Iyi email cyangwa username isanzwe ikoreshwa. Injira (Login) cyangwa ukoreshe indi.' });
        return;
      }

      const user = await UserModel.create({
        name,
        email: normalizedEmail,
        username: cleanIdentifier,
        passwordHash,
        role,
      });

      const token = generateToken(user._id.toString(), user.email, user.role, user.name);
      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          usageCount: user.usageCount,
        },
      });
      return;
    }

    // In-memory fallback
    const existing = memoryStore.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail || (u as any).username === cleanIdentifier
    );
    if (existing) {
      res.status(400).json({ success: false, message: 'Iyi email cyangwa username isanzwe ikoreshwa.' });
      return;
    }

    const newUser: StoredUser = {
      _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email: normalizedEmail,
      passwordHash,
      role: role as any,
      usageCount: { chat: 0, translations: 0, lessons: 0, documents: 0, tokens: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryStore.users.push(newUser);
    const token = generateToken(newUser._id, newUser.email, newUser.role, newUser.name);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        usageCount: newUser.usageCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = loginSchema.safeParse(req.body);
    if (!validated.success) {
      res.status(400).json({ success: false, errors: validated.error.flatten().fieldErrors });
      return;
    }

    const { email, password } = validated.data;
    const identifier = email.trim().toLowerCase();

    // Check for special bobo / bobo admin credential
    if ((identifier === 'bobo' || identifier === 'bobo.bobo' || identifier === 'bobo@kinya.ai') && password === 'bobo') {
      await ensureAdminExists();
      if (isConnectedToMongo) {
        let adminUser = await UserModel.findOne({
          $or: [{ email: 'bobo@kinya.ai' }, { username: 'bobo' }],
        });
        if (adminUser) {
          const token = generateToken(adminUser._id.toString(), adminUser.email, 'admin', adminUser.name);
          res.json({
            success: true,
            token,
            user: {
              id: adminUser._id,
              name: adminUser.name,
              email: adminUser.email,
              role: 'admin',
              usageCount: adminUser.usageCount,
            },
          });
          return;
        }
      }
    }

    const normalizedEmail = identifier.includes('@') ? identifier : `${identifier}@kinya.ai`;

    if (isConnectedToMongo) {
      const user = await UserModel.findOne({
        $or: [{ email: identifier }, { email: normalizedEmail }, { username: identifier }, { name: identifier }],
      });

      if (!user) {
        res.status(401).json({ success: false, message: 'Email cyangwa Ijambo ry\'ibanga ntibikwiriye. Niba wibagiwe, kanda kuri "Wibagiwe Password".' });
        return;
      }

      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        res.status(401).json({ success: false, message: 'Email cyangwa Ijambo ry\'ibanga ntibikwiriye.' });
        return;
      }

      const token = generateToken(user._id.toString(), user.email, user.role, user.name);
      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          usageCount: user.usageCount,
        },
      });
      return;
    }

    // In-memory fallback
    const user = memoryStore.users.find(
      (u) =>
        u.email.toLowerCase() === identifier ||
        u.email.toLowerCase() === normalizedEmail ||
        (u as any).username === identifier ||
        u.name.toLowerCase() === identifier
    );

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken(user._id, user.email, user.role, user.name);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        usageCount: user.usageCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = forgotPasswordSchema.safeParse(req.body);
    if (!validated.success) {
      res.status(400).json({ success: false, message: 'Please provide email or username' });
      return;
    }

    const { email } = validated.data;
    const identifier = email.trim().toLowerCase();
    const normalizedEmail = identifier.includes('@') ? identifier : `${identifier}@kinya.ai`;
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (isConnectedToMongo) {
      const user = await UserModel.findOne({
        $or: [{ email: identifier }, { email: normalizedEmail }, { username: identifier }],
      });

      if (!user) {
        res.status(404).json({ success: false, message: 'Nta konti ifite iyi email cyangwa username yabonetse. Gerageza kwiyandikisha.' });
        return;
      }

      user.resetCode = resetCode;
      await user.save();

      res.json({
        success: true,
        message: 'Code yo gusubiramo password yoherejwe neza.',
        resetCode, // Sent back for easy one-click testing
        email: user.email,
      });
      return;
    }

    res.json({
      success: true,
      message: 'Code yo gusubiramo password yateguwe.',
      resetCode,
      email: identifier,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = resetPasswordSchema.safeParse(req.body);
    if (!validated.success) {
      res.status(400).json({ success: false, message: 'Invalid reset details.' });
      return;
    }

    const { email, newPassword } = validated.data;
    const identifier = email.trim().toLowerCase();
    const normalizedEmail = identifier.includes('@') ? identifier : `${identifier}@kinya.ai`;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    if (isConnectedToMongo) {
      const user = await UserModel.findOne({
        $or: [{ email: identifier }, { email: normalizedEmail }, { username: identifier }],
      });

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      user.passwordHash = passwordHash;
      user.resetCode = '';
      await user.save();

      res.json({ success: true, message: 'Password yahinduwe neza! Ubu ushobora kwinjira.' });
      return;
    }

    res.json({ success: true, message: 'Password yahinduwe neza.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (isConnectedToMongo) {
      const user = await UserModel.findById(req.user.id).select('-passwordHash');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.json({ success: true, user });
      return;
    }

    const user = memoryStore.users.find((u) => u._id === req.user?.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const { passwordHash, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const demoLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const role = (req.body.role || 'student') as 'general' | 'student' | 'professional' | 'business' | 'admin';
    const demoName = role === 'admin' ? 'Bobo Admin' : role === 'student' ? 'Bobo Student' : 'Bobo Client';
    const demoEmail = role === 'admin' ? 'bobo@kinya.ai' : `demo.${role}@kinya.ai`;

    let userId = `demo_${role}_id`;
    if (isConnectedToMongo) {
      let user = await UserModel.findOne({ email: demoEmail });
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(role === 'admin' ? 'bobo' : 'DemoPassword123!', salt);
        user = await UserModel.create({
          name: demoName,
          email: demoEmail,
          username: role === 'admin' ? 'bobo' : undefined,
          passwordHash: hash,
          role,
          usageCount: { chat: 8, translations: 14, lessons: 3, documents: 1, tokens: 1250 },
        });
      }
      userId = user._id.toString();
    } else {
      let user = memoryStore.users.find((u) => u.email === demoEmail);
      if (!user) {
        user = {
          _id: userId,
          name: demoName,
          email: demoEmail,
          passwordHash: 'hashed',
          role,
          usageCount: { chat: 8, translations: 14, lessons: 3, documents: 1, tokens: 1250 },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        memoryStore.users.push(user);
      }
    }

    const token = generateToken(userId, demoEmail, role, demoName);
    res.json({
      success: true,
      token,
      user: {
        id: userId,
        name: demoName,
        email: demoEmail,
        role,
        usageCount: { chat: 8, translations: 14, lessons: 3, documents: 1, tokens: 1250 },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
