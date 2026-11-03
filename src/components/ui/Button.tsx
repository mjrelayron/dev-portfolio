import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { playSound } from '../../hooks/useSound';

type Variant = 'primary' | 'ghost';
interface Common {
  variant?: Variant;
  size?: 'md' | 'sm';
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

const cls = (variant: Variant = 'primary', size: 'md' | 'sm' = 'md', extra = '') =>
  ['btn-3d', variant === 'ghost' && 'btn-3d--ghost', size === 'sm' && 'btn-3d--sm', extra].filter(Boolean).join(' ');

export const Button = forwardRef<HTMLButtonElement, Common & ButtonHTMLAttributes<HTMLButtonElement>>(function Button(
  { variant, size, icon, children, className, onClick, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cls(variant, size, className)}
      onClick={(e) => {
        playSound('pop');
        onClick?.(e);
      }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
});

/** Internal route (to) or external/file link (href). */
export function ButtonLink({
  to,
  href,
  variant,
  size,
  icon,
  children,
  className,
  ...rest
}: Common & { to?: string; href?: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const c = cls(variant, size, className);
  if (to) {
    return (
      <Link to={to} className={c} onClick={() => playSound('pop')} {...rest}>
        {icon}
        {children}
      </Link>
    );
  }
  const external = href?.startsWith('http');
  return (
    <a href={href} className={c} {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})} {...rest}>
      {icon}
      {children}
    </a>
  );
}
