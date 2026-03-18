import { type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  accent?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', strong, accent, onClick }: GlassCardProps) {
  const style = accent ? 'glass-accent' : strong ? 'glass-strong' : 'glass';
  return (
    <div
      onClick={onClick}
      className={`${style} rounded-3xl p-5 ${onClick ? 'cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01]' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
