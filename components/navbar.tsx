"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Table, 
  Menu, 
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>('dashboard');
  const [scrolled, setScrolled] = useState(false);

  // Add scroll listener for a dynamic header effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'entries', label: 'Entries', icon: BookOpen },
    { id: 'entry-table', label: 'Entry Table', icon: Table },
  ];

  const handleNavClick = (id: string) => {
    setActiveItem(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200' 
          : 'bg-slate-50 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 text-base tracking-tight leading-none uppercase">
                wing0015
              </span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
                Dewanbag Sharif
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                    flex items-center gap-2 overflow-hidden
                    ${isActive 
                      ? 'text-white shadow-md shadow-emerald-100' 
                      : 'text-slate-500 hover:text-emerald-600 hover:bg-white'
                    }
                  `}
                >
                  {/* Background Layer for Active */}
                  {isActive && (
                    <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-600 animate-in fade-in zoom-in-95 duration-300"></div>
                  )}
                  
                  <Icon className={`relative z-10 w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={`
          md:hidden fixed inset-x-0 top-20 bg-white border-b border-slate-100 shadow-2xl
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}
        `}
      >
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center justify-between px-4 py-4 rounded-2xl text-sm font-bold
                  transition-all duration-200
                  ${isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <span>{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-0' : '-translate-x-2 opacity-0'}`} />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;