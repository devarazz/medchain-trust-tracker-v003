
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBatch, Batch } from '@/contexts/BatchContext';
import { QrCode, Search, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import BatchJourney from './BatchJourney';

interface VerifyBatchFormProps {
  onVerify?: (batch: Batch) => void;
}

const VerifyBatchForm: React.FC<VerifyBatchFormProps> = ({ onVerify }) => {
  const [batchId, setBatchId] = useState('');
  const [error, setError] = useState('');
  const { getBatch, setSelectedBatch } = useBatch();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!batchId.trim()) {
      setError('Please enter a batch ID');
      return;
    }
    
    const foundBatch = getBatch(batchId.trim());
    
    if (!foundBatch) {
      setError(`No batch found with ID: ${batchId}`);
      setSelectedBatch(null);
      return;
    }
    
    setSelectedBatch(foundBatch);
    setError('');
    
    if (onVerify) {
      onVerify(foundBatch);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Verify Batch</h3>
        <p className="text-sm text-muted-foreground">
          Enter a batch ID to verify its authenticity and track its journey through the supply chain.
        </p>
      </div>
      
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="batchId">Batch ID</Label>
          <div className="flex gap-2">
            <Input
              id="batchId"
              placeholder="Enter batch ID (e.g., BATCH-X12Y5)"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
            />
            <Button type="button" variant="outline" size="icon">
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button type="submit" className="w-full">
          <Search className="mr-2 h-4 w-4" /> Verify Batch
        </Button>
      </form>
      
      {/* Removed the conditional rendering of batch here since we now use the global context */}
    </div>
  );
};

export default VerifyBatchForm;
