import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Mic,
  MicOff,
  User,
  Bot,
  MessageSquare,
} from 'lucide-react';
import { chatAPI } from '../services/api';
import { Conversation, Message } from '../types';

export const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const promptStarters = [
    'Mfasha kwiga React & JavaScript mu Kinyarwanda 💻',
    'Nandikira email y\'akazi yo gusaba akazi mu Cyongereza ✉️',
    'Sobanura Ubwenge bw\'Ubukorano (AI) mu magambo make 🧠',
    'Ni ayahe mahirwe y\'ikoranabuhanga mu Rwanda uyu munsi? 🇷🇼',
  ];

  // Initialize conversations
  useEffect(() => {
    loadConversations();
    initSpeechRecognition();
  }, []);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadConversations = async () => {
    try {
      const res = await chatAPI.getConversations();
      if (res.success) {
        setConversations(res.conversations);
        if (res.conversations.length > 0 && !activeConversationId) {
          selectConversation(res.conversations[0]._id);
        }
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
    }
  };

  const selectConversation = async (convId: string) => {
    setActiveConversationId(convId);
    try {
      const res = await chatAPI.getMessages(convId);
      if (res.success) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(undefined);
    setMessages([]);
    setInput('');
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await chatAPI.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (activeConversationId === id) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage({
        conversationId: activeConversationId,
        message: messageText,
        language: 'rw',
      });

      if (res.success) {
        setMessages((prev) => [...prev, res.reply]);
        if (!activeConversationId) {
          setActiveConversationId(res.conversationId);
          loadConversations();
        }
      }
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Mumbabarire, habaye akabazo mu guhuza na seriveri. Gerageza kongera kohereza ubutumwa.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Speech Recognition setup (Web Speech API)
  const initSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'rw-RW'; // Kinyarwanda or fallback

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] md:h-screen flex flex-col md:flex-row overflow-hidden bg-[#070c09]">
      {/* Conversations Drawer (Left on Desktop) */}
      <div className="hidden lg:flex w-72 flex-col bg-[#09120d] border-r border-emerald-950/70 shrink-0">
        <div className="p-4 border-b border-emerald-950/60">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Ikiganiro Gishya (New Chat)</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
            Ibiganiro Byahise
          </div>
          {conversations.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-6 px-4">
              Nta biganiro birabikwa
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => selectConversation(conv._id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs font-medium transition-all ${
                  activeConversationId === conv._id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#112217]'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{conv.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(e, conv._id)}
                  title="Siba"
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#070c09]">
        {/* Chat Header Bar */}
        <div className="h-14 px-6 border-b border-emerald-950/60 bg-[#0a140e]/90 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wide">
              KinyaAI Studio
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              Kinya-LLM Core v1
            </span>
          </div>

          <button
            onClick={handleNewChat}
            className="lg:hidden text-xs flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Gishya</span>
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/10">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white">
                  Muraho! Ndi KinyaAI. 👋
                </h2>
                <p className="text-sm text-slate-300">
                  Ushobora kumbaza ibibazo mu Kinyarwanda cyangwa Icyongereza. Hitamo interuro yo gutangiriraho cyangwa wandike icyo wifuza:
                </p>
              </div>

              {/* Prompt Starter Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {promptStarters.map((starter, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(starter)}
                    className="p-3 text-left rounded-xl bg-[#0e1a12] hover:bg-[#14281c] border border-emerald-900/60 hover:border-emerald-500/50 text-xs text-slate-200 transition-all group"
                  >
                    <span className="group-hover:text-emerald-300 transition-colors">
                      {starter}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              const msgId = msg._id || `msg_${index}`;

              return (
                <div
                  key={msgId}
                  className={`flex items-start space-x-3 max-w-3xl ${
                    isUser ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                      isUser
                        ? 'bg-emerald-600 text-slate-950 font-bold'
                        : 'bg-[#122419] border border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`group relative p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-[#0f1d14] border border-emerald-900/70 text-slate-100 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {!isUser && (
                      <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-emerald-950/80 text-[10px] text-slate-400">
                        <button
                          onClick={() => copyToClipboard(msg.content, msgId)}
                          className="flex items-center space-x-1 hover:text-emerald-300 transition-colors"
                        >
                          {copiedId === msgId ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Byakopiwe</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Kopera</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {loading && (
            <div className="flex items-start space-x-3 max-w-3xl mr-auto">
              <div className="w-8 h-8 rounded-xl bg-[#122419] border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-xs shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-[#0f1d14] border border-emerald-900/70 text-sm text-emerald-400 flex items-center space-x-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                <span
                  className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
                <span className="text-xs text-slate-400 ml-2">KinyaAI irimo gutekereza...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#0a140e] border-t border-emerald-950/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-4xl mx-auto flex items-end space-x-2"
          >
            <div className="flex-1 relative rounded-2xl bg-[#0f1e14] border border-emerald-900/70 focus-within:border-emerald-500 transition-colors p-2 flex items-center">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                placeholder="Andika ikibazo mu Kinyarwanda cyangwa Icyongereza..."
                className="flex-1 bg-transparent border-none text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none px-2 max-h-32"
              />

              {/* Microphone speech toggle */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-colors shrink-0 ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-emerald-400 hover:bg-[#152a1c]'
                }`}
                title="Vugira muri microphone"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-40 transition-all shrink-0 shadow-lg shadow-emerald-500/20 font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-center text-slate-500 mt-2">
            KinyaAI itanga amakuru n'ubusemuzi. Buri gihe suzuma amakuru y'ingenzi mu bushakashatsi bwawe.
          </div>
        </div>
      </div>
    </div>
  );
};
