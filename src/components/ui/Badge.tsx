import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  onRemove?: () => void;
  className?: string;
}

export function Badge({ children, color, onRemove, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
      style={color ? { backgroundColor: `${color}20`, color } : undefined}
    >
      {!color && <span className="inline-flex items-center gap-1 bg-accent/10 text-accent rounded-full px-2.5 py-0.5">{children}</span>}
      {color && children}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 hover:opacity-70 transition-opacity">
          &times;
        </button>
      )}
    </span>
  );
}
