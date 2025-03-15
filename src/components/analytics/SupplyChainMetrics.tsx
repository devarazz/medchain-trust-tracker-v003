
import React from 'react';
import { useBatch } from '@/contexts/BatchContext';
import MetricCard from './MetricCard';
import { calculateSupplyChainHealth, getHealthColor } from './utils/analyticsUtils';
import { AlertTriangle, ArrowUpRight, CheckCircle2, ClipboardCheck, Package, ShieldCheck } from 'lucide-react';

const SupplyChainMetrics: React.FC = () => {
  const { batches, batchNotifications } = useBatch();
  
  const supplyChainHealth = calculateSupplyChainHealth(batches);
  const unreadAlerts = batchNotifications.filter(n => !n.read).length;
  
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Supply Chain Health"
        value={`${supplyChainHealth}%`}
        icon={ShieldCheck}
        iconColor={getHealthColor(supplyChainHealth)}
        progress={supplyChainHealth}
        description="Overall blockchain verification level"
      />
      
      <MetricCard
        title="Total Batches"
        value={batches.length}
        icon={Package}
        iconColor="text-blue-500"
        trend={{
          value: `${batches.filter(b => b.status === 'delivered').length} delivered`,
          isPositive: true
        }}
      />
      
      <MetricCard
        title="Alert Notifications"
        value={unreadAlerts}
        icon={AlertTriangle}
        iconColor={unreadAlerts > 0 ? 'text-amber-500' : 'text-green-500'}
        description="Unread notifications requiring attention"
      />
      
      <MetricCard
        title="Verification Rate"
        value={`${batches.length > 0 
          ? Math.round((batches.filter(b => b.signatures.length === 4).length / batches.length) * 100)
          : 0}%`}
        icon={ClipboardCheck}
        iconColor="text-blue-500"
        description="Fully verified batches in blockchain"
      />
    </div>
  );
};

export default SupplyChainMetrics;
