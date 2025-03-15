
import React, { useState } from 'react';
import { useBatch, Batch } from '@/contexts/BatchContext';
import BatchDetail from './BatchDetail';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import BatchSearch from './BatchSearch';
import BatchGrid from './BatchGrid';
import BatchReportDialog from './BatchReportDialog';

interface BatchListProps {
  type?: 'default' | 'verify' | 'sign';
  title?: string;
  description?: string;
  batches?: Batch[];
}

const BatchList: React.FC<BatchListProps> = ({
  type = 'default',
  title = 'Manage Batches',
  description = 'All registered medicine batches',
  batches: propBatches,
}) => {
  const { batches: contextBatches, signBatch, reportFakeBatch } = useBatch();
  const batches = propBatches || contextBatches;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [batchToReport, setBatchToReport] = useState<string | null>(null);
  
  // Filter batches
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = 
      batch.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      batch.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleOpenBatchDetail = (batch: Batch) => {
    setSelectedBatch(batch);
  };
  
  const handleCloseBatchDetail = () => {
    setSelectedBatch(null);
  };
  
  const handleSignBatch = (batchId: string) => {
    signBatch(batchId);
  };
  
  const handleReportBatch = (batchId: string) => {
    setBatchToReport(batchId);
    setReportDialogOpen(true);
  };
  
  const handleSubmitReport = () => {
    if (batchToReport && reportReason) {
      reportFakeBatch(batchToReport, reportReason);
      setReportDialogOpen(false);
      setBatchToReport(null);
      setReportReason('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <BatchSearch 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      <BatchGrid 
        batches={filteredBatches}
        type={type}
        onView={handleOpenBatchDetail}
        onSign={handleSignBatch}
        onReport={handleReportBatch}
      />
      
      {selectedBatch && (
        <Dialog open={!!selectedBatch} onOpenChange={(open) => !open && handleCloseBatchDetail()}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Batch Details</DialogTitle>
            </DialogHeader>
            <BatchDetail batch={selectedBatch} />
          </DialogContent>
        </Dialog>
      )}
      
      <BatchReportDialog
        open={reportDialogOpen}
        setOpen={setReportDialogOpen}
        reportReason={reportReason}
        setReportReason={setReportReason}
        onSubmit={handleSubmitReport}
      />
    </div>
  );
};

export default BatchList;
