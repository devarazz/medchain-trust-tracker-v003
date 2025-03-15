
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  description?: string;
  progress?: number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor,
  description,
  progress,
  trend,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {progress !== undefined && (
          <Progress value={progress} className="h-2 mt-2" />
        )}
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend.value}
            {trend.isPositive && (
              <span className="text-green-500 ml-1 inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                  <path d="M7 17L17 7M17 7H8M17 7V16" />
                </svg>
              </span>
            )}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
