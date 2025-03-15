import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VerifyBatchForm from '@/components/shared/VerifyBatchForm';
import BatchJourney from '@/components/shared/BatchJourney';
import { useBatch } from '@/contexts/BatchContext';

interface ConsumerPortalProps {
  activeTab?: string;
}

const ConsumerPortal: React.FC<ConsumerPortalProps> = ({ activeTab = 'dashboard' }) => {
  const { selectedBatch } = useBatch();
  const [localActiveTab, setLocalActiveTab] = React.useState(activeTab);
  
  // Sync with parent activeTab when it changes
  useEffect(() => {
    setLocalActiveTab(activeTab);
  }, [activeTab]);

  // Map sidebar IDs to tab values
  const mapSidebarToTab = (sidebarId: string) => {
    const mapping: Record<string, string> = {
      'dashboard': 'dashboard',
      'track': 'track',
      'certificate': 'certificate'
    };
    return mapping[sidebarId] || 'dashboard';
  };

  // Update local tab state when parent activeTab changes
  useEffect(() => {
    setLocalActiveTab(mapSidebarToTab(activeTab));
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Medicine Verification Portal</h1>
        <p className="text-muted-foreground">
          Verify the authenticity of medicine batches.
        </p>
      </div>
      
      <Tabs value={localActiveTab} onValueChange={setLocalActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="track">Track Batch</TabsTrigger>
          <TabsTrigger value="certificate">Certificate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="pt-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Welcome to MedChain</h2>
            <p className="mb-4">
              MedChain helps you verify the authenticity of pharmaceutical products by tracking 
              their journey through the supply chain.
            </p>
            <p className="mb-4">
              To verify a medicine batch:
            </p>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Go to the "Track Batch" tab</li>
              <li>Enter the Batch ID found on your medicine packaging</li>
              <li>View the complete journey of your medicine</li>
              <li>Verify that it has passed through authenticated supply chain partners</li>
            </ol>
            <p>
              If you find any discrepancies, please contact your healthcare provider immediately.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="track" className="pt-4">
          <VerifyBatchForm />
          
          {selectedBatch && (
            <div className="mt-8">
              <BatchJourney batch={selectedBatch} />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="certificate" className="pt-4">
          {selectedBatch ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Authenticity Certificate</h2>
              <p className="mb-6">The medicine batch has been verified through MedChain.</p>
              
              <div className="mb-4">
                <h3 className="font-medium text-sm text-muted-foreground">Medicine</h3>
                <p className="text-lg">{selectedBatch.medicineName}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-sm text-muted-foreground">Batch ID</h3>
                <p className="text-lg">{selectedBatch.id}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-sm text-muted-foreground">Manufacturer</h3>
                <p className="text-lg">{selectedBatch.manufacturerName}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-sm text-muted-foreground">Manufacturing Date</h3>
                <p className="text-lg">{new Date(selectedBatch.manufacturingDate).toLocaleDateString()}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-sm text-muted-foreground">Expiry Date</h3>
                <p className="text-lg">{new Date(selectedBatch.expiryDate).toLocaleDateString()}</p>
              </div>
              
              <button 
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => {
                  window.print();
                }}
              >
                Print Certificate
              </button>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800">
              Please track a batch first to view its certificate.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsumerPortal;
