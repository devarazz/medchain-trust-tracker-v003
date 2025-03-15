import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { 
  BarChart, 
  BookOpen,
  ClipboardCheck,
  FileText, 
  Home, 
  Microscope,
  PackageCheck, 
  Search, 
  Shield, 
  Truck,
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const roleIcon: Record<UserRole, React.ReactNode> = {
    manufacturer: <Microscope className="h-5 w-5" />,
    wholesaler: <PackageCheck className="h-5 w-5" />,
    distributor: <Truck className="h-5 w-5" />,
    retailer: <ClipboardCheck className="h-5 w-5" />,
    consumer: <Search className="h-5 w-5" />
  };
  
  const dashboardTitles: Record<UserRole, string> = {
    manufacturer: 'Manufacturer Dashboard',
    wholesaler: 'Wholesaler Dashboard',
    distributor: 'Distributor Dashboard',
    retailer: 'Retailer Dashboard',
    consumer: 'Consumer Dashboard'
  };
  
  const menuItems = [
    { label: dashboardTitles[user.role], icon: <Home className="h-5 w-5" />, id: 'dashboard' },
  ];
  
  if (user.role === 'manufacturer') {
    menuItems.push(
      { label: 'Register Batch', icon: <FileText className="h-5 w-5" />, id: 'register' },
      { label: 'Manage Batch', icon: <BarChart className="h-5 w-5" />, id: 'manage' },
      { label: 'Verify Tracking', icon: <Shield className="h-5 w-5" />, id: 'verify' }
    );
  } else if (user.role === 'consumer') {
    menuItems.push(
      { label: 'Track Batch', icon: <Search className="h-5 w-5" />, id: 'track' },
      { label: 'Certificate', icon: <BookOpen className="h-5 w-5" />, id: 'certificate' }
    );
  } else {
    menuItems.push(
      { label: 'Verify Batch', icon: <Shield className="h-5 w-5" />, id: 'verify' },
      { label: 'Sign Batch', icon: <FileText className="h-5 w-5" />, id: 'sign' },
      { label: 'Manage Batch', icon: <BarChart className="h-5 w-5" />, id: 'manage' },
      { label: 'Report Fake', icon: <ClipboardCheck className="h-5 w-5" />, id: 'report' }
    );
  }

  const handleMenuClick = (id: string) => {
    if (setActiveTab) {
      setActiveTab(id);
    }
    
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <ShadcnSidebar>
        <SidebarHeader className="flex items-center justify-between border-b px-4 py-3">
          <div className={cn("flex items-center gap-2", !sidebarOpen && "lg:hidden")}>
            {roleIcon[user.role]}
            <span className="font-semibold">MedChain</span>
          </div>
          <div className={cn("hidden", !sidebarOpen && "lg:flex lg:justify-center lg:w-full")}>
            {roleIcon[user.role]}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className="lg:flex"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={activeTab === item.id}
                  tooltip={item.label}
                  onClick={() => handleMenuClick(item.id)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ShadcnSidebar>
    </SidebarProvider>
  );
};

export default Sidebar;
