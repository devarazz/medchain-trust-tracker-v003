
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VerifyBatchForm from '@/components/shared/VerifyBatchForm';
import BatchList from '@/components/batch/BatchList';
import { useBatch } from '@/contexts/BatchContext';

interface RetailerDashboardProps {
  activeTab?: string;
}

const RetailerDashboard: React.FC<RetailerDashboardProps> = ({ activeTab = 'dashboard' }) => {
  const { batches, verifiedBatches } = useBatch();
  const [localActiveTab, setLocalActiveTab] = React.useState(activeTab);
  
  // Sync with parent activeTab when it changes
  useEffect(() => {
    setLocalActiveTab(activeTab);
  }, [activeTab]);
  
  // Batches that have been signed by this role
  const signedBatches = batches.filter(batch => 
    batch.signatures.some(sig => sig.role === 'retailer')
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Retailer Dashboard</h1>
        <p className="text-muted-foreground">
          Verify and sell authenticated medicine batches.
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
              <h2 className="text-lg font-semibold">Inventory Received</h2>
              <div className="text-3xl font-bold">{verifiedBatches.length}</div>
              <p className="text-sm text-muted-foreground">Batches awaiting verification</p>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Verified Inventory</h2>
              <div className="text-3xl font-bold">{signedBatches.length}</div>
              <p className="text-sm text-muted-foreground">Batches ready for consumer purchase</p>
            </div>
          </div>
          
          <div className="mt-8">
            <BatchList 
              batches={signedBatches}
              title="Recent Activity" 
              description="Recently verified medicine batches"
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
            title="Batches to Verify" 
            description="Verify these batches before selling to consumers"
          />
        </TabsContent>
        
        <TabsContent value="manage" className="pt-4">
          <BatchList 
            batches={signedBatches.concat(verifiedBatches)}
            title="All Inventory" 
            description="Manage all batches in your inventory"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RetailerDashboard;
