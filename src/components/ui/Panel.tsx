import type { HTMLAttributes, ReactNode } from 'react';

export function Panel({ as: Tag = 'div', className = '', children, ...rest }: { as?: 'div' | 'section' | 'article' | 'aside'; children?: ReactNode } & HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={`panel ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
