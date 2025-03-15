
import React from 'react';
import VerifyBatchForm from '@/components/shared/VerifyBatchForm';
import DashboardContainer from './DashboardContainer';
import DashboardTabs, { TabItem } from './DashboardTabs';
import WholesalerDashboardContent from './wholesaler/WholesalerDashboardContent';
import WholesalerSignContent from './wholesaler/WholesalerSignContent';
import WholesalerManageContent from './wholesaler/WholesalerManageContent';

interface WholesalerDashboardProps {
  activeTab?: string;
}

const WholesalerDashboard: React.FC<WholesalerDashboardProps> = ({ activeTab = 'dashboard' }) => {
  const tabs: TabItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      content: <WholesalerDashboardContent />
    },
    {
      id: 'verify',
      label: 'Verify Batch',
      content: <VerifyBatchForm />
    },
    {
      id: 'sign',
      label: 'Sign Batch',
      content: <WholesalerSignContent />
    },
    {
      id: 'manage',
      label: 'Manage Batch',
      content: <WholesalerManageContent />
    }
  ];
  
  return (
    <DashboardContainer
      title="Wholesaler Dashboard"
      description="Verify and sign medicine batches in the supply chain."
    >
      <DashboardTabs tabs={tabs} activeTab={activeTab} />
    </DashboardContainer>
  );
};

export default WholesalerDashboard;
