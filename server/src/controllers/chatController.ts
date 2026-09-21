import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ConversationModel } from '../models/Conversation';
import { MessageModel } from '../models/Message';
import { UserModel } from '../models/User';
import { memoryStore, StoredConversation, StoredMessage } from '../config/inMemoryStore';
import { isConnectedToMongo } from '../config/db';
import { AIService, ChatMessageParam } from '../services/aiService';
import { chatMessageSchema } from '../validators';

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'guest_user';
    const validated = chatMessageSchema.safeParse(req.body);

    if (!validated.success) {
      res.status(400).json({ success: false, errors: validated.error.flatten().fieldErrors });
      return;
    }

    let { conversationId, message, language = 'rw', systemInstruction } = validated.data;

    let conversationTitle = message.slice(0, 32) + (message.length > 32 ? '...' : '');

    // 1. Resolve or create conversation
    if (isConnectedToMongo) {
      let conv;
      if (conversationId) {
        conv = await ConversationModel.findOne({ _id: conversationId, userId });
      }

      if (!conv) {
        conv = await ConversationModel.create({
          userId,
          title: conversationTitle,
          language,
          systemPrompt: systemInstruction || '',
        });
        conversationId = conv._id.toString();
      }

      // Fetch history for AI context
      const prevMessages = await MessageModel.find({ conversationId })
        .sort({ createdAt: 1 })
        .limit(10);

      const aiHistory: ChatMessageParam[] = prevMessages.map((m) => ({
        role: m.role as any,
        content: m.content,
      }));
      aiHistory.push({ role: 'user', content: message });

      // Save user message
      await MessageModel.create({
        conversationId,
        role: 'user',
        content: message,
        language,
        model: 'user-input',
      });

      // Call AI Service
      const aiResult = await AIService.generateChatResponse(aiHistory, systemInstruction);

      // Save assistant message
      const botMsg = await MessageModel.create({
        conversationId,
        role: 'assistant',
        content: aiResult.response,
        language,
        model: aiResult.model,
        tokens: aiResult.tokens,
      });

      // Update conversation timestamp
      conv.updatedAt = new Date();
      await conv.save();

      // Update user metrics
      if (req.user?.id) {
        await UserModel.findByIdAndUpdate(req.user.id, {
          $inc: { 'usageCount.chat': 1, 'usageCount.tokens': aiResult.tokens },
        });
      }

      res.json({
        success: true,
        conversationId,
        reply: {
          id: botMsg._id,
          role: botMsg.role,
          content: botMsg.content,
          model: botMsg.model,
          tokens: botMsg.tokens,
          createdAt: botMsg.createdAt,
        },
      });
      return;
    }

    // In-Memory Fallback
    let conv = conversationId ? memoryStore.conversations.find((c) => c._id === conversationId && c.userId === userId) : null;
    if (!conv) {
      conv = {
        _id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        title: conversationTitle,
        language,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.conversations.unshift(conv);
      conversationId = conv._id;
    }

    const prevMsgs = memoryStore.messages.filter((m) => m.conversationId === conversationId).slice(-10);
    const aiHistory: ChatMessageParam[] = prevMsgs.map((m) => ({ role: m.role, content: m.content }));
    aiHistory.push({ role: 'user', content: message });

    // Store user message
    memoryStore.messages.push({
      _id: `msg_${Date.now()}_u`,
      conversationId: conversationId!,
      role: 'user',
      content: message,
      language,
      model: 'user-input',
      tokens: 0,
      createdAt: new Date(),
    });

    const aiResult = await AIService.generateChatResponse(aiHistory, systemInstruction);

    // Store bot message
    const botMsg: StoredMessage = {
      _id: `msg_${Date.now()}_b`,
      conversationId: conversationId!,
      role: 'assistant',
      content: aiResult.response,
      language,
      model: aiResult.model,
      tokens: aiResult.tokens,
      createdAt: new Date(),
    };
    memoryStore.messages.push(botMsg);
    conv.updatedAt = new Date();

    // Update user stats
    const u = memoryStore.users.find((x) => x._id === userId);
    if (u) {
      u.usageCount.chat += 1;
      u.usageCount.tokens += aiResult.tokens;
    }

    res.json({
      success: true,
      conversationId,
      reply: botMsg,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to send message' });
  }
};

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'guest_user';

    if (isConnectedToMongo) {
      const conversations = await ConversationModel.find({ userId }).sort({ updatedAt: -1 });
      res.json({ success: true, conversations });
      return;
    }

    const conversations = memoryStore.conversations
      .filter((c) => c.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    res.json({ success: true, conversations });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getConversationMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo) {
      const messages = await MessageModel.find({ conversationId: id }).sort({ createdAt: 1 });
      res.json({ success: true, messages });
      return;
    }

    const messages = memoryStore.messages
      .filter((m) => m.conversationId === id)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    res.json({ success: true, messages });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const renameConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || typeof title !== 'string') {
      res.status(400).json({ success: false, message: 'Title is required' });
      return;
    }

    if (isConnectedToMongo) {
      await ConversationModel.findByIdAndUpdate(id, { title });
      res.json({ success: true, message: 'Conversation renamed' });
      return;
    }

    const conv = memoryStore.conversations.find((c) => c._id === id);
    if (conv) conv.title = title;
    res.json({ success: true, message: 'Conversation renamed' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo) {
      await ConversationModel.findByIdAndDelete(id);
      await MessageModel.deleteMany({ conversationId: id });
      res.json({ success: true, message: 'Conversation deleted' });
      return;
    }

    memoryStore.conversations = memoryStore.conversations.filter((c) => c._id !== id);
    memoryStore.messages = memoryStore.messages.filter((m) => m.conversationId !== id);
    res.json({ success: true, message: 'Conversation deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
