
import React from 'react';
import { useBatch } from '@/contexts/BatchContext';
import BatchList from '@/components/batch/BatchList';
import DashboardStatsSummary from '../DashboardStatsSummary';

const RetailerDashboardContent: React.FC = () => {
  const { batches, verifiedBatches } = useBatch();
  
  // Batches that have been signed by this role
  const signedBatches = batches.filter(batch => 
    batch.signatures.some(sig => sig.role === 'retailer')
  );

  const stats = [
    {
      title: "Inventory Received",
      value: verifiedBatches.length,
      description: "Batches awaiting verification"
    },
    {
      title: "Verified Inventory",
      value: signedBatches.length,
      description: "Batches ready for consumer purchase"
    }
  ];

  return (
    <>
      <DashboardStatsSummary stats={stats} />
      
      <div className="mt-8">
        <BatchList 
          batches={signedBatches}
          title="Recent Activity" 
          description="Recently verified medicine batches"
        />
      </div>
    </>
  );
};

export default RetailerDashboardContent;
