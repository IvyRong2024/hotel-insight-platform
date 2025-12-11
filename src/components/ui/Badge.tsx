import clsx from 'clsx';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  warning: 'bg-amber-50 text-amber-600 border-amber-200',
  danger: 'bg-red-50 text-red-600 border-red-200',
  info: 'bg-blue-50 text-brand-blue border-blue-200',
  neutral: 'bg-slate-50 text-slate-600 border-slate-200',
};

export function Badge({ children, variant = 'neutral', pulse = false, size = 'md' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        variantClasses[variant],
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
        pulse && variant === 'danger' && 'animate-pulse'
      )}
    >
      {pulse && variant === 'danger' && (
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
      )}
      {children}
    </span>
  );
}
