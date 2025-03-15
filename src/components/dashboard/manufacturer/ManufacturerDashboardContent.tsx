
import React from 'react';
import { useBatch } from '@/contexts/BatchContext';
import { useAuth } from '@/contexts/AuthContext';
import BatchList from '@/components/batch/BatchList';

const ManufacturerDashboardContent: React.FC = () => {
  const { user } = useAuth();
  const { batches } = useBatch();
  
  // Filter batches created by this manufacturer
  const manufacturerBatches = batches.filter(
    batch => batch.manufacturerName === user?.name
  );
  
  return (
    <BatchList 
      batches={manufacturerBatches} 
      title="Manage Batches" 
      description="Monitor your registered medicine batches"
    />
  );
};

export default ManufacturerDashboardContent;
