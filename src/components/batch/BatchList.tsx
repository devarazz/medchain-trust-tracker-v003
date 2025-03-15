
import React, { useState } from 'react';
import { useBatch, Batch } from '@/contexts/BatchContext';
import BatchCard from '@/components/shared/BatchCard';
import BatchDetail from './BatchDetail';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or batch ID"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="registered">Registered</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      {filteredBatches.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No batches found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBatches.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              type={type}
              onView={() => handleOpenBatchDetail(batch)}
              onSign={type === 'sign' ? () => handleSignBatch(batch.id) : undefined}
              onReport={
                type === 'default' ? () => handleReportBatch(batch.id) : undefined
              }
            />
          ))}
        </div>
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
      
      {/* Report Fake Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Fake or Suspicious Batch</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="reason">
                Reason for Reporting
              </label>
              <textarea
                id="reason"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe the issue with this batch"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setReportDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleSubmitReport}
              disabled={!reportReason.trim()}
            >
              Report Batch
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BatchList;
