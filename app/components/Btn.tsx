import { ReactNode } from 'react';

interface BtnProps {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
  onClick?: () => void;
}

export function Btn({ children, href, variant = 'primary', className = '', onClick }: BtnProps) {
  const base =
    'inline-flex items-center gap-2 font-semibold rounded-xl px-6 py-3 transition-all duration-200 cursor-pointer';
  const styles = {
    primary:
      'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5',
    outline:
      'border border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 bg-transparent',
    ghost: 'text-slate-400 hover:text-white bg-transparent',
  };
  const cls = `${base} ${styles[variant]} ${className}`;
  if (href) {
    const isExternal = !href.startsWith('#') && !href.startsWith('/');
    return (
      <a
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={cls}
      >
        {children}
      </a>
    );
  }
  return (
    <button className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
