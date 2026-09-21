import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Menu, X, Globe, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-950/60 bg-[#070c09]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <div className="w-full h-full bg-[#0c1610] rounded-[10px] flex items-center justify-center group-hover:bg-[#102318] transition-colors">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
              Kinya<span className="text-emerald-400">AI</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-emerald-500/80 font-semibold block -mt-1">
              Rwanda & Beyond
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-emerald-400 transition-colors">
            Iby'Ingenzi (Features)
          </a>
          <a href="#translator" className="hover:text-emerald-400 transition-colors">
            Guhindura Indimi (Translator)
          </a>
          <a href="#learning" className="hover:text-emerald-400 transition-colors">
            Kwiga & Study
          </a>
          <a href="#pricing" className="hover:text-emerald-400 transition-colors">
            Ibiciro (Pricing)
          </a>
          <a href="#faq" className="hover:text-emerald-400 transition-colors">
            Ibibazo Bikunze Kubazwa
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300">
            <Globe className="w-3.5 h-3.5" />
            <span>RW / EN</span>
          </div>

          {isAuthenticated ? (
            <Link
              to="/app/dashboard"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              <span>Fungura Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Injira (Login)
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>Tangira Ubuntu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-emerald-950 bg-[#0c1610] px-4 pt-3 pb-6 space-y-4">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 hover:text-emerald-400"
          >
            Iby'Ingenzi (Features)
          </a>
          <a
            href="#translator"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 hover:text-emerald-400"
          >
            Guhindura Indimi (Translator)
          </a>
          <a
            href="#learning"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 hover:text-emerald-400"
          >
            Kwiga & Study
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 hover:text-emerald-400"
          >
            Ibiciro (Pricing)
          </a>
          <div className="pt-2 border-t border-emerald-950 flex flex-col space-y-2">
            {isAuthenticated ? (
              <Link
                to="/app/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm"
              >
                Fungura Dashboard ({user?.name})
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-xl border border-emerald-800 text-sm font-medium text-slate-200"
                >
                  Injira (Login)
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm"
                >
                  Tangira Ubuntu (Register)
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
