
import React from 'react';

interface DashboardContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      
      {children}
    </div>
  );
};

export default DashboardContainer;
