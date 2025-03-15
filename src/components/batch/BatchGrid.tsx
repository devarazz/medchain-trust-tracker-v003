
import React from 'react';
import { Batch } from '@/types/batch';
import BatchCard from '@/components/shared/BatchCard';

interface BatchGridProps {
  batches: Batch[];
  type?: 'default' | 'verify' | 'sign';
  onViewBatch: (batch: Batch) => void;
  onSignBatch?: (batchId: string) => void;
  onReportBatch?: (batchId: string) => void;
}

const BatchGrid: React.FC<BatchGridProps> = ({
  batches,
  type = 'default',
  onViewBatch,
  onSignBatch,
  onReportBatch,
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
          onView={() => onViewBatch(batch)}
          onSign={type === 'sign' && onSignBatch ? () => onSignBatch(batch.id) : undefined}
          onReport={
            type === 'default' && onReportBatch ? () => onReportBatch(batch.id) : undefined
          }
        />
      ))}
    </div>
  );
};

export default BatchGrid;
