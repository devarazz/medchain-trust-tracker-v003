
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, LogOut, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useBatch } from '@/contexts/BatchContext';
import NotificationPanel from './NotificationPanel';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const { batchNotifications } = useBatch();
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  
  const unreadNotifications = batchNotifications.filter(n => !n.read).length;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const roleDisplay = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '';

  return (
    <header className={cn(
      "sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b backdrop-blur-sm dark:border-border/20 dark:bg-background/80 bg-white/80",
      sidebarOpen ? "lg:pl-64" : "lg:pl-20",
      "transition-all duration-300"
    )}>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold">MedChain</h1>
          <p className="text-xs text-muted-foreground">{roleDisplay} Dashboard</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <NotificationPanel onClose={() => setNotificationsOpen(false)} />
          </SheetContent>
        </Sheet>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.username}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
