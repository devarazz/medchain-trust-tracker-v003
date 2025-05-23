
import React from 'react';
import { Batch } from '@/types/batch';
import BatchJourney from '@/components/shared/BatchJourney';

interface BatchDetailProps {
  batch: Batch;
}

const BatchDetail: React.FC<BatchDetailProps> = ({ batch }) => {
  return <BatchJourney batch={batch} />;
};

export default BatchDetail;
