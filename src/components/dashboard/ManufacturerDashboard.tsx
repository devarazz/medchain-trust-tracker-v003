
import React from 'react';
import RegisterBatchForm from '@/components/batch/RegisterBatchForm';
import VerifyBatchForm from '@/components/shared/VerifyBatchForm';
import DashboardContainer from './DashboardContainer';
import DashboardTabs, { TabItem } from './DashboardTabs';
import ManufacturerDashboardContent from './manufacturer/ManufacturerDashboardContent';

interface ManufacturerDashboardProps {
  activeTab?: string;
}

const ManufacturerDashboard: React.FC<ManufacturerDashboardProps> = ({ activeTab = 'dashboard' }) => {
  const tabs: TabItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      content: <ManufacturerDashboardContent />
    },
    {
      id: 'register',
      label: 'Register Batch',
      content: <RegisterBatchForm />
    },
    {
      id: 'verify',
      label: 'Verify Tracking',
      content: <VerifyBatchForm />
    }
  ];
  
  return (
    <DashboardContainer
      title="Manufacturer Dashboard"
      description="Manage and track medical batches in the supply chain."
    >
      <DashboardTabs tabs={tabs} activeTab={activeTab} />
    </DashboardContainer>
  );
};

export default ManufacturerDashboard;
