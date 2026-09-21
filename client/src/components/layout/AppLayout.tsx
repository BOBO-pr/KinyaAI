import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { FeedbackModal } from '../common/FeedbackModal';
import { MomoPaymentModal } from '../common/MomoPaymentModal';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Sparkles, CreditCard } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [momoOpen, setMomoOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070c09] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-sm font-medium text-slate-400">KinyaAI irimo gufunguka...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-[#070c09] flex text-slate-100 print:bg-[#051108] print:block print:min-h-0 print:h-auto">
      {/* Desktop Sidebar */}
      <div className="hidden md:block print:hidden">
        <Sidebar
          onFeedbackClick={() => setFeedbackOpen(true)}
          onPaymentClick={() => setMomoOpen(true)}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex print:hidden">
          <div className="fixed inset-0 bg-black/80" onClick={() => setMobileNavOpen(false)} />
          <div className="relative z-10 w-64">
            <Sidebar
              onFeedbackClick={() => {
                setMobileNavOpen(false);
                setFeedbackOpen(true);
              }}
              onPaymentClick={() => {
                setMobileNavOpen(false);
                setMomoOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto print:overflow-visible print:block print:w-full print:m-0 print:p-0">
        {/* Mobile Header Bar */}
        <div className="md:hidden h-16 px-4 bg-[#09110c] border-b border-emerald-950 flex items-center justify-between sticky top-0 z-30 print:hidden">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="text-lg font-bold text-white">
            Kinya<span className="text-emerald-400">AI</span>
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMomoOpen(true)}
              className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center space-x-1"
            >
              <CreditCard className="w-3 h-3" />
              <span>MoMo</span>
            </button>
            <button
              onClick={() => setFeedbackOpen(true)}
              className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
            >
              Feedback
            </button>
          </div>
        </div>

        {/* Nested route content */}
        <main className="flex-1 print:w-full print:m-0 print:p-0">
          <Outlet />
        </main>
      </div>

      {/* Global Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />

      {/* Global Rwandan Mobile Money Modal */}
      <MomoPaymentModal
        isOpen={momoOpen}
        onClose={() => setMomoOpen(false)}
        onSuccess={(tokensAdded) => {
          if (user?.usageCount) {
            user.usageCount.tokens = (user.usageCount.tokens || 0) + tokensAdded;
          }
        }}
      />
    </div>
  );
};

export default AppLayout;
