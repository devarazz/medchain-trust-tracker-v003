
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn("relative", className)}
      aria-label="Toggle theme"
    >
      <Sun className={cn(
        "h-5 w-5 absolute transition-all",
        theme === 'dark' ? "scale-0 opacity-0" : "scale-100 opacity-100"
      )} />
      <Moon className={cn(
        "h-5 w-5 absolute transition-all", 
        theme === 'dark' ? "scale-100 opacity-100" : "scale-0 opacity-0"
      )} />
    </Button>
  );
};

export default ThemeToggle;
