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
    sm: { value: 'text-xl', label: 'text-xs' },
    md: { value: 'text-2xl', label: 'text-xs' },
    lg: { value: 'text-3xl', label: 'text-sm' },
  };

  const TrendIcon = trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus;
  const trendColor = trendDirection === 'up' ? 'text-emerald-500' : trendDirection === 'down' ? 'text-red-500' : 'text-slate-400';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <span className={clsx('text-slate-500 font-medium', sizeClasses[size].label)}>{label}</span>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>

      <div className="flex items-end gap-2">
        <span className={clsx('font-bold text-slate-800', sizeClasses[size].value)}>
          {value}
          {suffix && <span className="text-sm text-slate-400 ml-0.5">{suffix}</span>}
        </span>

        {trend && (
          <div className={clsx('flex items-center gap-0.5 text-xs mb-0.5', trendColor)}>
            <TrendIcon size={12} />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}
