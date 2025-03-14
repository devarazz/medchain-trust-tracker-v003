
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VerifyBatchForm from '@/components/shared/VerifyBatchForm';
import BatchList from '@/components/batch/BatchList';
import { useBatch, Batch } from '@/contexts/BatchContext';

const WholesalerDashboard: React.FC = () => {
  const { batches, verifiedBatches } = useBatch();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Batches that have been signed by this role
  const signedBatches = batches.filter(batch => 
    batch.signatures.some(sig => sig.role === 'wholesaler')
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wholesaler Dashboard</h1>
        <p className="text-muted-foreground">
          Verify and sign medicine batches in the supply chain.
        </p>
      </div>
      
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="verify">Verify Batch</TabsTrigger>
          <TabsTrigger value="sign">Sign Batch</TabsTrigger>
          <TabsTrigger value="manage">Manage Batch</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Pending Verification</h2>
              <div className="text-3xl font-bold">{verifiedBatches.length}</div>
              <p className="text-sm text-muted-foreground">Batches awaiting your signature</p>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Signed Batches</h2>
              <div className="text-3xl font-bold">{signedBatches.length}</div>
              <p className="text-sm text-muted-foreground">Batches you have verified</p>
            </div>
          </div>
          
          <div className="mt-8">
            <BatchList 
              batches={signedBatches}
              title="Recent Activity" 
              description="Recent batches you have signed"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="verify" className="pt-4">
          <VerifyBatchForm />
        </TabsContent>
        
        <TabsContent value="sign" className="pt-4">
          <BatchList 
            type="sign"
            batches={verifiedBatches}
            title="Batches to Sign" 
            description="Verify and sign these batches to continue their journey"
          />
        </TabsContent>
        
        <TabsContent value="manage" className="pt-4">
          <BatchList 
            batches={signedBatches.concat(verifiedBatches)}
            title="All Batches" 
            description="Manage all batches in your inventory"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WholesalerDashboard;
