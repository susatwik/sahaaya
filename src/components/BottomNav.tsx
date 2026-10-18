import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquareQuote, CalendarCheck, Users, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  onOpenMore?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenMore }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: '/', label: t.navHome, icon: Home },
    { path: '/ask', label: t.navAsk, icon: MessageSquareQuote },
    { path: '/visits', label: t.navVisits, icon: CalendarCheck },
    { path: '/households', label: t.navHouseholds, icon: Users },
    { path: '/protocols', label: t.navGuides, icon: BookOpen },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1 shadow-lg safe-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 min-w-[52px] min-h-[48px] flex-1 ${
                isActive
                  ? 'text-sahaaya-navy font-semibold scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-sahaaya-soft-blue text-sahaaya-navy' : ''}`}>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] sm:text-[11px] mt-0.5 tracking-tight truncate max-w-[62px] text-center ${isActive ? 'font-bold text-sahaaya-navy' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
