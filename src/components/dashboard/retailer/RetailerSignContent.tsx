
import React from 'react';
import { useBatch } from '@/contexts/BatchContext';
import BatchList from '@/components/batch/BatchList';

const RetailerSignContent: React.FC = () => {
  const { verifiedBatches } = useBatch();

  return (
    <BatchList 
      type="sign"
      batches={verifiedBatches}
      title="Batches to Verify" 
      description="Verify these batches before selling to consumers"
    />
  );
};

export default RetailerSignContent;
