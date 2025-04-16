
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VerifyBatchForm from '@/components/shared/VerifyBatchForm';
import BatchList from '@/components/batch/BatchList';
import { useBatch } from '@/contexts/BatchContext';

interface DistributorDashboardProps {
  activeTab?: string;
}

const DistributorDashboard: React.FC<DistributorDashboardProps> = ({ activeTab = 'dashboard' }) => {
  const { batches, verifiedBatches } = useBatch();
  const [localActiveTab, setLocalActiveTab] = React.useState(activeTab);
  console.log("didtrinbiutoe: ",batches,verifiedBatches)
  // Sync with parent activeTab when it changes
  useEffect(() => {
    setLocalActiveTab(activeTab);
  }, [activeTab]);
  
  // Batches that have been signed by this role
  const signedBatches = batches.filter(batch => 
    batch.signatures.some(sig => sig.role === 'distributor')
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Distributor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage distribution and verification of medicine batches.
        </p>
      </div>
      
      <Tabs value={localActiveTab} onValueChange={setLocalActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="verify">Verify Batch</TabsTrigger>
          <TabsTrigger value="sign">Sign Batch</TabsTrigger>
          <TabsTrigger value="manage">Manage Batch</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Pending Distribution</h2>
              <div className="text-3xl font-bold">{verifiedBatches.length}</div>
              <p className="text-sm text-muted-foreground">Batches awaiting your signature</p>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Distributed Batches</h2>
              <div className="text-3xl font-bold">{signedBatches.length}</div>
              <p className="text-sm text-muted-foreground">Batches you have distributed</p>
            </div>
          </div>
          
          <div className="mt-8">
            <BatchList 
              batches={signedBatches}
              title="Recent Activity" 
              description="Recently distributed batches"
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
            title="Batches to Distribute" 
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

export default DistributorDashboard;
