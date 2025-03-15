
import React from 'react';

interface StatItemProps {
  title: string;
  value: number;
  description: string;
}

const StatItem: React.FC<StatItemProps> = ({ title, value, description }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="text-3xl font-bold">{value}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

interface DashboardStatsSummaryProps {
  stats: StatItemProps[];
}

const DashboardStatsSummary: React.FC<DashboardStatsSummaryProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stats.map((stat, index) => (
        <StatItem 
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
        />
      ))}
    </div>
  );
};

export default DashboardStatsSummary;
