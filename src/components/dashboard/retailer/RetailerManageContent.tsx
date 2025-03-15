
import React from 'react';
import { useBatch } from '@/contexts/BatchContext';
import BatchList from '@/components/batch/BatchList';

const RetailerManageContent: React.FC = () => {
  const { batches, verifiedBatches } = useBatch();
  
  // Batches that have been signed by this role
  const signedBatches = batches.filter(batch => 
    batch.signatures.some(sig => sig.role === 'retailer')
  );

  return (
    <BatchList 
      batches={signedBatches.concat(verifiedBatches)}
      title="All Inventory" 
      description="Manage all batches in your inventory"
    />
  );
};

export default RetailerManageContent;
