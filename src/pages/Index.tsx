
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import ManufacturerDashboard from '@/components/dashboard/ManufacturerDashboard';
import WholesalerDashboard from '@/components/dashboard/WholesalerDashboard';
import DistributorDashboard from '@/components/dashboard/DistributorDashboard';
import RetailerDashboard from '@/components/dashboard/RetailerDashboard';
import ConsumerPortal from '@/components/dashboard/ConsumerPortal';
import Sidebar from '@/components/shared/Sidebar';
import Header from '@/components/shared/Header';

const Index = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary font-medium">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    );
  }
  
  // Render the appropriate dashboard based on user role and active tab
  const renderDashboard = () => {
    switch (user.role) {
      case 'manufacturer':
        return <ManufacturerDashboard activeTab={activeTab} />;
      case 'wholesaler':
        return <WholesalerDashboard activeTab={activeTab} />;
      case 'distributor':
        return <DistributorDashboard activeTab={activeTab} />;
      case 'retailer':
        return <RetailerDashboard activeTab={activeTab} />;
      case 'consumer':
        return <ConsumerPortal activeTab={activeTab} />;
      default:
        return <div>Unknown role</div>;
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}>
        <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        
        <main className="container mx-auto py-6 px-4 animate-fade-in">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default Index;
