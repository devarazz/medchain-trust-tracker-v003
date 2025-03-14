
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import ManufacturerDashboard from '@/components/dashboard/ManufacturerDashboard';
import WholesalerDashboard from '@/components/dashboard/WholesalerDashboard';
import DistributorDashboard from '@/components/dashboard/DistributorDashboard';
import RetailerDashboard from '@/components/dashboard/RetailerDashboard';
import ConsumerPortal from '@/components/dashboard/ConsumerPortal';
import AppSidebar from '@/components/shared/AppSidebar';
import Header from '@/components/shared/Header';
import { SidebarInset, useSidebar } from '@/components/ui/sidebar';

const Index = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { state } = useSidebar();
  
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
  
  // Render the appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (user.role) {
      case 'manufacturer':
        return <ManufacturerDashboard />;
      case 'wholesaler':
        return <WholesalerDashboard />;
      case 'distributor':
        return <DistributorDashboard />;
      case 'retailer':
        return <RetailerDashboard />;
      case 'consumer':
        return <ConsumerPortal />;
      default:
        return <div>Unknown role</div>;
    }
  };
  
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="container mx-auto py-6 px-4 animate-fade-in">
          {renderDashboard()}
        </main>
      </SidebarInset>
    </div>
  );
};

export default Index;
