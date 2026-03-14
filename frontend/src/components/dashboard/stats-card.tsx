import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export const StatsCard = ({ title, value, icon: Icon, description, trend, className = '' }: StatsCardProps) => {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
          <Icon size={24} />
        </div>
      </div>
      {(description || trend) && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span className={`text-xs font-medium ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isUp ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
          )}
          {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
      )}
    </div>
  );
};
