
import React from 'react';
import VerifyBatchForm from '@/components/shared/VerifyBatchForm';
import DashboardContainer from './DashboardContainer';
import DashboardTabs, { TabItem } from './DashboardTabs';
import DistributorDashboardContent from './distributor/DistributorDashboardContent';
import DistributorSignContent from './distributor/DistributorSignContent';
import DistributorManageContent from './distributor/DistributorManageContent';

interface DistributorDashboardProps {
  activeTab?: string;
}

const DistributorDashboard: React.FC<DistributorDashboardProps> = ({ activeTab = 'dashboard' }) => {
  const tabs: TabItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      content: <DistributorDashboardContent />
    },
    {
      id: 'verify',
      label: 'Verify Batch',
      content: <VerifyBatchForm />
    },
    {
      id: 'sign',
      label: 'Sign Batch',
      content: <DistributorSignContent />
    },
    {
      id: 'manage',
      label: 'Manage Batch',
      content: <DistributorManageContent />
    }
  ];
  
  return (
    <DashboardContainer
      title="Distributor Dashboard"
      description="Manage distribution and verification of medicine batches."
    >
      <DashboardTabs tabs={tabs} activeTab={activeTab} />
    </DashboardContainer>
  );
};

export default DistributorDashboard;
