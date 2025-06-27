import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  formatAsCurrency?: boolean;
} 

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  className = '',
  formatAsCurrency = true
}: StatsCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number' && formatAsCurrency) {
      return formatCurrency(val, 'INR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
    return val;
  };

  return (
    <Card className={`transition-all hover:shadow-md ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatValue(value)}
        </div>
        {trend && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            <span
              className={`inline-flex items-center ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </span>
            {' '}from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
