import type { ReactNode } from 'react';

export function Tag({ children, active, className = '' }: { children: ReactNode; active?: boolean; className?: string }) {
  return (
    <span
      className={`chip ${className}`}
      style={active ? { background: 'var(--accent)', color: 'var(--navy)', borderColor: 'transparent' } : undefined}
    >
      {children}
    </span>
  );
}
