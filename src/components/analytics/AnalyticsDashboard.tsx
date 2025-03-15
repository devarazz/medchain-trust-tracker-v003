
import React from 'react';
import SupplyChainMetrics from './SupplyChainMetrics';
import StatusDistributionChart from './StatusDistributionChart';
import VerificationProgressChart from './VerificationProgressChart';
import BatchTimelineChart from './BatchTimelineChart';
import AlertAnalytics from './AlertAnalytics';

const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Supply Chain Analytics</h2>
        <p className="text-muted-foreground">Real-time insights into your pharmaceutical supply chain</p>
      </div>

      {/* Top metrics cards */}
      <SupplyChainMetrics />

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatusDistributionChart />
        <VerificationProgressChart />
      </div>

      {/* Timeline chart (full width) */}
      <BatchTimelineChart />

      {/* Alert analytics (full width) */}
      <AlertAnalytics />
    </div>
  );
};

export default AnalyticsDashboard;
