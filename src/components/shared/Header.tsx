
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MenuIcon, User, BellIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-full items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden mr-2"
        >
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        <div className="flex-1 flex items-center justify-end space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="relative"
          >
            <User className="h-5 w-5" />
          </Button>
          
          <div className="relative">
            <Button variant="ghost" size="icon">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
