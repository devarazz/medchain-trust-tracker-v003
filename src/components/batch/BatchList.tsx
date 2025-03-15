
import React, { useState } from 'react';
import { useBatch } from '@/contexts/BatchContext';
import { Batch } from '@/types/batch';
import BatchDetail from './BatchDetail';
import BatchListFilters from './BatchListFilters';
import BatchGrid from './BatchGrid';
import BatchReportDialog from './BatchReportDialog';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const [showAnalytics, setShowAnalytics] = useState(false);
  
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

  const toggleAnalyticsView = () => {
    setShowAnalytics(!showAnalytics);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <BatchListFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        showAnalytics={showAnalytics}
        toggleAnalyticsView={toggleAnalyticsView}
      />
      
      {showAnalytics ? (
        <AnalyticsDashboard />
      ) : (
        <BatchGrid 
          batches={filteredBatches}
          type={type}
          onViewBatch={handleOpenBatchDetail}
          onSignBatch={type === 'sign' ? handleSignBatch : undefined}
          onReportBatch={type === 'default' ? handleReportBatch : undefined}
        />
      )}
      
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
