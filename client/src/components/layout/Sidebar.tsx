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
  Feather,
  Trophy,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  onFeedbackClick: () => void;
  onPaymentClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onFeedbackClick, onPaymentClick }) => {
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
    { to: '/app/leaderboard', label: 'Indashyikirwa (Leaderboard)', icon: Trophy },
    { to: '/app/umusizi', label: 'Umusizi (Culture & Riddles)', icon: Feather },
    { to: '/app/voice', label: 'Ijwi (Voice Assistant)', icon: Mic },
    { to: '/app/summarize', label: 'Gusesengura (Docs)', icon: FileText },
    ...(user?.role === 'admin'
      ? [{ to: '/app/admin', label: 'Admin Portal', icon: ShieldCheck }]
      : []),
    { to: '/app/settings', label: 'Igenamiterere (Settings)', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-emerald-950/70 bg-[#09110c] flex flex-col justify-between shrink-0 h-screen sticky top-0 print:hidden overflow-y-auto">
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
        <nav className="p-3.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-emerald-950/30'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: Quota, User info & Logout */}
      <div className="p-3.5 border-t border-emerald-950/60 space-y-2.5">
        {/* Buy Tokens Button (MTN MoMo & Airtel) */}
        {onPaymentClick && (
          <button
            onClick={onPaymentClick}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-[#0e2215] to-emerald-500/15 hover:brightness-110 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <span className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Kugura Tokens (MoMo)</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
              *182#
            </span>
          </button>
        )}

        {/* Token Quota Progress */}
        <div className="p-2.5 rounded-xl bg-[#0e1a12] border border-emerald-900/40 text-xs">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span className="flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
              <Zap className="w-3 h-3" /> Tokens
            </span>
            <span className="text-slate-400 text-[10px]">
              {(user?.usageCount?.tokens || 1250).toLocaleString()} / 50k
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
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-200 truncate">
                {user?.name || 'Guest User'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sohoka (Logout)"
            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Feedback Trigger */}
        <button
          onClick={onFeedbackClick}
          className="w-full text-center py-1 text-[11px] text-emerald-400/80 hover:text-emerald-300 transition-colors"
        >
          💬 Tanga Igitekerezo (Feedback)
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
