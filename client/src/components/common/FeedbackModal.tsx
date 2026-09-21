import React, { useState } from 'react';
import { Star, X, Check, MessageSquare } from 'lucide-react';
import { adminAPI } from '../../services/api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFeature?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  defaultFeature = 'general',
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [feature, setFeature] = useState<string>(defaultFeature);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.submitFeedback({ feature, rating, comment });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setComment('');
        onClose();
      }, 1500);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0c1610] border border-emerald-500/30 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Murakoze Cyane!</h3>
            <p className="text-sm text-slate-300">
              Your feedback helps us refine Kinyarwanda language models and platform accuracy.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2 text-emerald-400">
              <MessageSquare className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">Tanga Igitekerezo (Feedback)</h3>
            </div>
            <p className="text-xs text-slate-400">
              Ese KinyaAI yakubereye ingirakamaro? Tanga amanota n'inama z'icyanozwa.
            </p>

            {/* Rating Stars */}
            <div className="flex items-center justify-center space-x-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Feature selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                Igice (Feature)
              </label>
              <select
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                className="w-full bg-[#122218] border border-emerald-900 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="chat">AI Chat & Language</option>
                <option value="translate">Kinyarwanda ↔ English Translator</option>
                <option value="learn">Learn & Study Center</option>
                <option value="voice">Voice Assistant</option>
                <option value="summarize">Document Summarizer</option>
                <option value="general">Rusange (General Platform)</option>
              </select>
            </div>

            {/* Comment */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                Ubutumwa cyangwa inama (Comments)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Andika hano uburambe bwawe cyangwa amagambo wifuza ko twanoza..."
                className="w-full bg-[#122218] border border-emerald-900 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/40"
              >
                Hagarika
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {loading ? 'Biri koherezwa...' : 'Ohereza Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
