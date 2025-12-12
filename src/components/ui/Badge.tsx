import clsx from 'clsx';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  pulse?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  warning: 'bg-amber-50 text-amber-600 border-amber-200',
  danger: 'bg-red-50 text-red-600 border-red-200',
  info: 'bg-[#003B6F]/10 text-[#003B6F] border-[#003B6F]/20',
  neutral: 'bg-slate-50 text-slate-600 border-slate-200',
};

export function Badge({ children, variant = 'neutral', pulse = false }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold',
        variantClasses[variant],
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
