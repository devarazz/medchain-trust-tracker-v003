
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'manufacturer' | 'wholesaler' | 'distributor' | 'retailer' | 'consumer';

interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('medchain_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // In a real app, this would validate credentials with an API
  const login = async (username: string, password: string, role: UserRole) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      username,
      role,
      name: username, // In a real app, this would come from the API
      organization: `${role.charAt(0).toUpperCase() + role.slice(1)} Inc.`,
    };
    
    setUser(newUser);
    localStorage.setItem('medchain_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medchain_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
