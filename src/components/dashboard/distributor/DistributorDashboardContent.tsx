
import React from 'react';
import { useBatch } from '@/contexts/BatchContext';
import BatchList from '@/components/batch/BatchList';
import DashboardStatsSummary from '../DashboardStatsSummary';

const DistributorDashboardContent: React.FC = () => {
  const { batches, verifiedBatches } = useBatch();
  
  // Batches that have been signed by this role
  const signedBatches = batches.filter(batch => 
    batch.signatures.some(sig => sig.role === 'distributor')
  );

  const stats = [
    {
      title: "Pending Distribution",
      value: verifiedBatches.length,
      description: "Batches awaiting your signature"
    },
    {
      title: "Distributed Batches",
      value: signedBatches.length,
      description: "Batches you have distributed"
    }
  ];

  return (
    <>
      <DashboardStatsSummary stats={stats} />
      
      <div className="mt-8">
        <BatchList 
          batches={signedBatches}
          title="Recent Activity" 
          description="Recently distributed batches"
        />
      </div>
    </>
  );
};

export default DistributorDashboardContent;
