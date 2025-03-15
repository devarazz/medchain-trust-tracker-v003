
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useBatch } from '@/contexts/BatchContext';
import { toast } from 'sonner';

const VerifyBatchForm: React.FC = () => {
  const [batchId, setBatchId] = useState('');
  const { getBatch, batches, setSelectedBatch } = useBatch();
  
  const handleVerifyBatch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!batchId.trim()) {
      toast.error('Please enter a batch ID');
      return;
    }
    
    const batch = getBatch(batchId);
    
    if (batch) {
      setSelectedBatch(batch);
      toast.success(`Batch ${batch.id} for ${batch.medicineName} found`);
    } else {
      setSelectedBatch(null);
      toast.error('No batch found with this ID');
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">Verify Medicine Batch</h2>
      <p className="mb-6 text-muted-foreground">
        Enter the batch ID found on your medicine packaging to verify its authenticity.
      </p>
      
      <form onSubmit={handleVerifyBatch} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Enter Batch ID (e.g., BATCH-X1Y2Z)"
            className="pl-10"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
          />
        </div>
        
        <Button type="submit" className="w-full">
          Verify Batch
        </Button>
        
        <p className="text-sm text-muted-foreground text-center">
          Batch IDs are printed on the medicine packaging or can be obtained from your healthcare provider.
        </p>
      </form>
    </div>
  );
};

export default VerifyBatchForm;
