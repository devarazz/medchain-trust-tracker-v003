
import React, { useState } from 'react';
import VerifyBatchForm from '@/components/shared/VerifyBatchForm';
import { Batch } from '@/contexts/BatchContext';
import BatchJourney from '@/components/shared/BatchJourney';

const ConsumerPortal: React.FC = () => {
  const [verifiedBatch, setVerifiedBatch] = useState<Batch | null>(null);

  const handleVerifyBatch = (batch: Batch) => {
    setVerifiedBatch(batch);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Medicine Verification Portal</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Verify the authenticity of your medicine by entering the batch ID found on the packaging.
        </p>
      </div>
      
      <div className="max-w-md mx-auto p-6 bg-white/50 backdrop-blur-sm border rounded-lg shadow-sm">
        <VerifyBatchForm onVerify={handleVerifyBatch} />
      </div>
      
      {verifiedBatch && (
        <div className="max-w-md mx-auto animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Verification Result</h2>
          <BatchJourney batch={verifiedBatch} />
        </div>
      )}
    </div>
  );
};

export default ConsumerPortal;
