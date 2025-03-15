
import React from 'react';
import { useBatch } from '@/contexts/BatchContext';
import BatchList from '@/components/batch/BatchList';

const DistributorSignContent: React.FC = () => {
  const { verifiedBatches } = useBatch();

  return (
    <BatchList 
      type="sign"
      batches={verifiedBatches}
      title="Batches to Distribute" 
      description="Verify and sign these batches to continue their journey"
    />
  );
};

export default DistributorSignContent;
