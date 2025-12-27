import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  subtitle?: string;
}

export const StatCard = ({
  title,
  value,
  change,
  trend = 'stable',
  icon: Icon,
  variant = 'default',
  subtitle,
}: StatCardProps) => {
  const variantStyles = {
    default: 'from-primary/20 to-primary/5 border-primary/20',
    success: 'from-success/20 to-success/5 border-success/20',
    warning: 'from-warning/20 to-warning/5 border-warning/20',
    danger: 'from-destructive/20 to-destructive/5 border-destructive/20',
  };

  const iconStyles = {
    default: 'text-primary bg-primary/20',
    success: 'text-success bg-success/20',
    warning: 'text-warning bg-warning/20',
    danger: 'text-destructive bg-destructive/20',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        variant="stat"
        className={cn(
          "relative overflow-hidden bg-gradient-to-br",
          variantStyles[variant]
        )}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">{title}</p>
              <motion.p
                className="text-3xl font-bold tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {value}
              </motion.p>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            <div className={cn("p-3 rounded-xl", iconStyles[variant])}>
              <Icon className="h-6 w-6" />
            </div>
          </div>

          {change !== undefined && (
            <div className={cn("flex items-center gap-1 mt-4", trendColor)}>
              <TrendIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last hour</span>
            </div>
          )}
        </div>

        {/* Decorative corner */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-current to-transparent opacity-5" />
      </Card>
    </motion.div>
  );
};
