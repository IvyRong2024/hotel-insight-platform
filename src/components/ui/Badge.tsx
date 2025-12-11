import clsx from 'clsx';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
  neutral: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

export function Badge({ children, variant = 'neutral', pulse = false, size = 'md' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        variantClasses[variant],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        pulse && variant === 'danger' && 'animate-pulse'
      )}
    >
      {pulse && variant === 'danger' && (
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
      )}
      {children}
    </span>
  );
}

