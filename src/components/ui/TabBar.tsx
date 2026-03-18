import { useLocation, useNavigate } from 'react-router';
import { BookOpen, HandHeart, PenLine, BarChart3, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { path: '/', icon: BookOpen, label: 'Scripture' },
  { path: '/pray', icon: HandHeart, label: 'Pray' },
  { path: '/journal', icon: PenLine, label: 'Journal' },
  { path: '/insights', icon: BarChart3, label: 'Insights' },
  { path: '/collection', icon: Heart, label: 'Collection' },
];

export function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-strong border-t border-white/30 z-30 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around max-w-lg mx-auto py-2">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 w-8 h-0.5 rounded-full"
                  style={{ background: '#007AFF' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                className={isActive ? 'text-accent' : 'text-apple-400'}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'text-accent' : 'text-apple-400'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
