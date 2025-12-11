import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import clsx from 'clsx';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  suffix?: string;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function MetricCard({
  label,
  value,
  trend,
  trendDirection = 'neutral',
  suffix,
  icon,
  size = 'md',
}: MetricCardProps) {
  const sizeClasses = {
    sm: {
      value: 'text-2xl',
      label: 'text-xs',
    },
    md: {
      value: 'text-3xl',
      label: 'text-sm',
    },
    lg: {
      value: 'text-4xl',
      label: 'text-sm',
    },
  };

  const TrendIcon = trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus;
  const trendColor = trendDirection === 'up' ? 'text-emerald-400' : trendDirection === 'down' ? 'text-red-400' : 'text-zinc-500';

  return (
    <div className="bg-dark-card/80 backdrop-blur-xl border border-dark-border rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className={clsx('text-zinc-500 font-medium', sizeClasses[size].label)}>{label}</span>
        {icon && <span className="text-zinc-600">{icon}</span>}
      </div>

      <div className="flex items-end gap-2">
        <span
          className={clsx(
            'font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent',
            sizeClasses[size].value
          )}
        >
          {value}
          {suffix && <span className="text-lg text-zinc-500 ml-1">{suffix}</span>}
        </span>

        {trend && (
          <div className={clsx('flex items-center gap-1 text-sm mb-1', trendColor)}>
            <TrendIcon size={14} />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}

