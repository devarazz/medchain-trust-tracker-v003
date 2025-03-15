
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
  X,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
  
  // Base menu items for all roles
  const menuItems = [
    { label: 'Dashboard', icon: <Home className="h-5 w-5" />, id: 'dashboard' },
  ];
  
  // Add role-specific menu items
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
    // For wholesaler, distributor, retailer
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
    
    // On mobile, close the sidebar after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full bg-white dark:bg-background border-r border-border dark:border-border/20 transform transition-all duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-16",
          "lg:transition-width"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b dark:border-border/20">
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
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <div className="py-4">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  activeTab === item.id 
                    ? "bg-primary/10 text-primary dark:bg-primary/20" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20",
                  !sidebarOpen && "lg:justify-center"
                )}
                onClick={() => handleMenuClick(item.id)}
              >
                {item.icon}
                <span className={cn("", !sidebarOpen && "lg:hidden")}>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
