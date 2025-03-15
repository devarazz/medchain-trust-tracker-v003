
import React from 'react';
import { useBatch } from '@/contexts/BatchContext';
import BatchList from '@/components/batch/BatchList';
import DashboardStatsSummary from '../DashboardStatsSummary';

const WholesalerDashboardContent: React.FC = () => {
  const { batches, verifiedBatches } = useBatch();
  
  // Batches that have been signed by this role
  const signedBatches = batches.filter(batch => 
    batch.signatures.some(sig => sig.role === 'wholesaler')
  );

  const stats = [
    {
      title: "Pending Verification",
      value: verifiedBatches.length,
      description: "Batches awaiting your signature"
    },
    {
      title: "Signed Batches",
      value: signedBatches.length,
      description: "Batches you have verified"
    }
  ];

  return (
    <>
      <DashboardStatsSummary stats={stats} />
      
      <div className="mt-8">
        <BatchList 
          batches={signedBatches}
          title="Recent Activity" 
          description="Recent batches you have signed"
        />
      </div>
    </>
  );
};

export default WholesalerDashboardContent;
