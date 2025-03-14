
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
  Truck
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';

const AppSidebar = () => {
  const { user } = useAuth();
  const { state } = useSidebar();
  
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
      { label: 'Register Batch', icon: <FileText className="h-5 w-5" />, id: 'register-batch' },
      { label: 'Manage Batch', icon: <BarChart className="h-5 w-5" />, id: 'manage-batch' },
      { label: 'Verify Tracking', icon: <Shield className="h-5 w-5" />, id: 'verify-tracking' }
    );
  } else if (user.role === 'consumer') {
    menuItems.push(
      { label: 'Track Batch', icon: <Search className="h-5 w-5" />, id: 'track-batch' },
      { label: 'Certificate', icon: <BookOpen className="h-5 w-5" />, id: 'certificate' }
    );
  } else {
    // For wholesaler, distributor, retailer
    menuItems.push(
      { label: 'Verify Batch', icon: <Shield className="h-5 w-5" />, id: 'verify-batch' },
      { label: 'Sign Batch', icon: <FileText className="h-5 w-5" />, id: 'sign-batch' },
      { label: 'Manage Batch', icon: <BarChart className="h-5 w-5" />, id: 'manage-batch' },
      { label: 'Report Fake', icon: <ClipboardCheck className="h-5 w-5" />, id: 'report-fake' }
    );
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarRail />
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          {roleIcon[user.role]}
          <span className="font-semibold">MedChain</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild tooltip={state === "collapsed" ? item.label : undefined}>
                    <a href={`#${item.id}`}>
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-2 text-xs text-muted-foreground">
          MedChain © 2023
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
