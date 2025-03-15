
import React from 'react';
import { Batch } from '@/contexts/BatchContext';
import BatchCard from '@/components/shared/BatchCard';

interface BatchGridProps {
  batches: Batch[];
  type: 'default' | 'verify' | 'sign';
  onView: (batch: Batch) => void;
  onSign?: (batchId: string) => void;
  onReport?: (batchId: string) => void;
}

const BatchGrid: React.FC<BatchGridProps> = ({
  batches,
  type,
  onView,
  onSign,
  onReport,
}) => {
  if (batches.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No batches found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {batches.map((batch) => (
        <BatchCard
          key={batch.id}
          batch={batch}
          type={type}
          onView={() => onView(batch)}
          onSign={type === 'sign' && onSign ? () => onSign(batch.id) : undefined}
          onReport={
            type === 'default' && onReport ? () => onReport(batch.id) : undefined
          }
        />
      ))}
    </div>
  );
};

export default BatchGrid;
