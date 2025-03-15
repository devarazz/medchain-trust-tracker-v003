
import React from 'react';
import VerifyBatchForm from '@/components/shared/VerifyBatchForm';
import DashboardContainer from './DashboardContainer';
import DashboardTabs, { TabItem } from './DashboardTabs';
import RetailerDashboardContent from './retailer/RetailerDashboardContent';
import RetailerSignContent from './retailer/RetailerSignContent';
import RetailerManageContent from './retailer/RetailerManageContent';

interface RetailerDashboardProps {
  activeTab?: string;
}

const RetailerDashboard: React.FC<RetailerDashboardProps> = ({ activeTab = 'dashboard' }) => {
  const tabs: TabItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      content: <RetailerDashboardContent />
    },
    {
      id: 'verify',
      label: 'Verify Batch',
      content: <VerifyBatchForm />
    },
    {
      id: 'sign',
      label: 'Sign Batch',
      content: <RetailerSignContent />
    },
    {
      id: 'manage',
      label: 'Manage Batch',
      content: <RetailerManageContent />
    }
  ];
  
  return (
    <DashboardContainer
      title="Retailer Dashboard"
      description="Verify and sell authenticated medicine batches."
    >
      <DashboardTabs tabs={tabs} activeTab={activeTab} />
    </DashboardContainer>
  );
};

export default RetailerDashboard;
