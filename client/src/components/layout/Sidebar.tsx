import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Languages,
  GraduationCap,
  Mic,
  FileText,
  ShieldCheck,
  Settings,
  LogOut,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC<{ onFeedbackClick: () => void }> = ({ onFeedbackClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/app/chat', label: 'AI Chat Studio', icon: MessageSquare },
    { to: '/app/translate', label: 'Ururimi (Translator)', icon: Languages },
    { to: '/app/learn', label: 'Kwiga (Learn & Quiz)', icon: GraduationCap },
    { to: '/app/voice', label: 'Ijwi (Voice Assistant)', icon: Mic },
    { to: '/app/summarize', label: 'Gusesengura (Docs)', icon: FileText },
    ...(user?.role === 'admin'
      ? [{ to: '/app/admin', label: 'Admin Portal', icon: ShieldCheck }]
      : []),
    { to: '/app/settings', label: 'Igenamiterere (Settings)', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-emerald-950/70 bg-[#09110c] flex flex-col justify-between shrink-0 h-screen sticky top-0 print:hidden">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-6 border-b border-emerald-950/60 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Kinya<span className="text-emerald-400">AI</span>
            </span>
          </Link>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
            {user?.role || 'Guest'}
          </span>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#112117]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: Quota, User info & Logout */}
      <div className="p-4 border-t border-emerald-950/60 space-y-3">
        {/* Token Quota Progress */}
        <div className="p-3 rounded-xl bg-[#0e1a12] border border-emerald-900/40 text-xs">
          <div className="flex items-center justify-between text-slate-300 mb-1.5">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Zap className="w-3.5 h-3.5" /> Tokens
            </span>
            <span className="text-slate-400">
              {user?.usageCount?.tokens || 1250} / 50k
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{
                width: `${Math.min(100, Math.max(5, ((user?.usageCount?.tokens || 1250) / 50000) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 font-bold flex items-center justify-center text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <div className="text-sm font-semibold text-slate-200 truncate">
                {user?.name || 'Guest User'}
              </div>
              <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sohoka (Logout)"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Trigger */}
        <button
          onClick={onFeedbackClick}
          className="w-full text-center py-1.5 text-xs text-emerald-400/80 hover:text-emerald-300 transition-colors"
        >
          💬 Tanga Igitekerezo (Feedback)
        </button>
      </div>
    </aside>
  );
};
