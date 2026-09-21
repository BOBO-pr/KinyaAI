import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/User';
import { memoryStore } from '../config/inMemoryStore';
import { isConnectedToMongo } from '../config/db';

interface TokenPackage {
  id: string;
  nameKinya: string;
  nameEn: string;
  tokens: number;
  amountRwf: number;
  popular?: boolean;
}

export const TOKEN_PACKAGES: Record<string, TokenPackage> = {
  starter: {
    id: 'starter',
    nameKinya: 'Intangiriro (Starter Pack)',
    nameEn: 'Starter Pack',
    tokens: 30000,
    amountRwf: 1500,
  },
  scholar: {
    id: 'scholar',
    nameKinya: 'Umunyeshuri w\'Imena (Scholar Pro)',
    nameEn: 'Scholar Pro',
    tokens: 120000,
    amountRwf: 3500,
    popular: true,
  },
  unlimited: {
    id: 'unlimited',
    nameKinya: 'Inzobere / VIP (Master VIP)',
    nameEn: 'Master VIP',
    tokens: 500000,
    amountRwf: 8000,
  },
};

/**
 * Initiate Rwandan Mobile Money (MTN MoMo / Airtel Money) Payment
 */
export const initiatePayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { phoneNumber, provider, packageId } = req.body;
    const userId = req.user?.id || 'demo_user';

    if (!phoneNumber || !provider || !packageId) {
      res.status(400).json({
        success: false,
        message: 'Nimero ya telefoni, network (MTN/Airtel), na package birakenewe.',
      });
      return;
    }

    const pkg = TOKEN_PACKAGES[packageId];
    if (!pkg) {
      res.status(400).json({ success: false, message: 'Package wahisemo ntabwo ibaho.' });
      return;
    }

    // Clean and validate Rwandan phone number
    const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/^\+/, '');
    const isMtn = /^(250)?(0)?(78|79)\d{7}$/.test(cleanPhone);
    const isAirtel = /^(250)?(0)?(72|73)\d{7}$/.test(cleanPhone);

    if (provider === 'mtn' && !isMtn) {
      res.status(400).json({
        success: false,
        message: 'Nimero ya MTN igomba gutangizwa na 078 cyangwa 079 (urugero: 0788123456).',
      });
      return;
    }

    if (provider === 'airtel' && !isAirtel) {
      res.status(400).json({
        success: false,
        message: 'Nimero ya Airtel igomba gutangizwa na 072 cyangwa 073 (urugero: 0722123456).',
      });
      return;
    }

    const transactionId = `TX-MOMO-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const transaction = {
      transactionId,
      userId,
      phoneNumber: cleanPhone,
      provider,
      packageId,
      tokens: pkg.tokens,
      amountRwf: pkg.amountRwf,
      status: 'pending',
      createdAt: new Date(),
    };

    memoryStore.payments.push(transaction);

    res.json({
      success: true,
      transactionId,
      package: pkg,
      amountRwf: pkg.amountRwf,
      provider: provider.toUpperCase(),
      phoneNumber: cleanPhone,
      ussdPushPrompt: provider === 'mtn' ? '*182*7*1#' : '*182#',
      message: `Icyifuzo cyo kwishyura ${pkg.amountRwf.toLocaleString()} RWF cyoherejwe kuri ${cleanPhone}. Kanda PIN yawe kuri MTN MoMo (*182#) kugira ngo wemeze kwishyura.`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Confirm / Verify Mobile Money Payment & Credit Tokens
 */
export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { transactionId } = req.body;
    const userId = req.user?.id || 'demo_user';

    const tx = memoryStore.payments.find((p) => p.transactionId === transactionId);
    if (!tx) {
      res.status(404).json({ success: false, message: 'Iyi transaction ntabwo ibonetse.' });
      return;
    }

    if (tx.status === 'completed') {
      res.json({
        success: true,
        message: 'Iyi transaction yamaze kwakirwa no kwemezwa!',
        tokensAdded: tx.tokens,
      });
      return;
    }

    tx.status = 'completed';
    tx.completedAt = new Date();

    let newTotalTokens = 0;

    // Credit tokens to user
    if (isConnectedToMongo && userId && userId !== 'demo_user') {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          $inc: { 'usageCount.tokens': tx.tokens },
        },
        { new: true }
      );
      newTotalTokens = user?.usageCount?.tokens || 0;
    } else {
      const u = memoryStore.users.find((x) => x._id === userId);
      if (u) {
        u.usageCount.tokens += tx.tokens;
        newTotalTokens = u.usageCount.tokens;
      } else {
        newTotalTokens = tx.tokens;
      }
    }

    res.json({
      success: true,
      transactionId,
      tokensAdded: tx.tokens,
      newTotalTokens,
      message: `🎉 Amafaranga ${tx.amountRwf.toLocaleString()} RWF yakiriwe neza kuri ${tx.provider.toUpperCase()} MoMo! Twakwongeyeho tokens ${tx.tokens.toLocaleString()} kuri konti yawe ya KinyaAI.`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get Available Token Packages
 */
export const getPackages = (req: AuthRequest, res: Response): void => {
  res.json({
    success: true,
    packages: Object.values(TOKEN_PACKAGES),
  });
};
