
import React, { useState } from 'react';
import RegisterBatchForm from '@/components/batch/RegisterBatchForm';
import BatchList from '@/components/batch/BatchList';
import VerifyBatchForm from '@/components/shared/VerifyBatchForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useBatch } from '@/contexts/BatchContext';

const ManufacturerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { batches } = useBatch();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Filter batches created by this manufacturer
  const manufacturerBatches = batches.filter(
    batch => batch.manufacturerName === user?.name
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manufacturer Dashboard</h1>
        <p className="text-muted-foreground">
          Manage and track medical batches in the supply chain.
        </p>
      </div>
      
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="register">Register Batch</TabsTrigger>
          <TabsTrigger value="verify">Verify Tracking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="pt-4">
          <BatchList 
            batches={manufacturerBatches} 
            title="Manage Batches" 
            description="Monitor your registered medicine batches"
          />
        </TabsContent>
        
        <TabsContent value="register" className="pt-4">
          <RegisterBatchForm />
        </TabsContent>
        
        <TabsContent value="verify" className="pt-4">
          <VerifyBatchForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManufacturerDashboard;
