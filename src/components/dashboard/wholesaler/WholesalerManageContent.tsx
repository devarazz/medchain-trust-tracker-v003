
import React from 'react';
import { useBatch } from '@/contexts/BatchContext';
import BatchList from '@/components/batch/BatchList';

const WholesalerManageContent: React.FC = () => {
  const { batches, verifiedBatches } = useBatch();
  
  // Batches that have been signed by this role
  const signedBatches = batches.filter(batch => 
    batch.signatures.some(sig => sig.role === 'wholesaler')
  );

  return (
    <BatchList 
      batches={signedBatches.concat(verifiedBatches)}
      title="All Batches" 
      description="Manage all batches in your inventory"
    />
  );
};

export default WholesalerManageContent;
