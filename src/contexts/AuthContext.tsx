import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'manufacturer' | 'wholesaler' | 'distributor' | 'retailer' | 'consumer';

interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  organization?: string;
  walletAddress?: string; // Add wallet address for MetaMask users
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    usernameOrWallet: string, 
    passwordOrSignature: string, 
    role: UserRole, 
    isMetaMask?: boolean,
    displayName?: string
  ) => Promise<void>;
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

  // Unified login function that handles both credential and MetaMask logins
  const login = async (
    usernameOrWallet: string, 
    passwordOrSignature: string, 
    role: UserRole, 
    isMetaMask = false,
    displayName?: string
  ) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let newUser: User;
    
    if (isMetaMask) {
      // Handle MetaMask login
      // In a real app, you would verify the signature on your backend
      
      // Use wallet address as ID and username
      const walletAddress = usernameOrWallet;
      const signature = passwordOrSignature;
      const name = displayName || 'Anonymous User'; // Use provided name or default
      
      newUser = {
        id: walletAddress,
        username: `wallet_${walletAddress.substring(0, 8)}`, // Create username from wallet address
        role,
        name, // Use the display name provided
        organization: `${role.charAt(0).toUpperCase() + role.slice(1)} Inc.`,
        walletAddress, // Store the full wallet address
      };
    } else {
      // Handle credential login (original implementation)
      newUser = {
        id: Math.random().toString(36).substring(2, 9),
        username: usernameOrWallet,
        role,
        name: usernameOrWallet, // In a real app, this would come from the API
        organization: `${role.charAt(0).toUpperCase() + role.slice(1)} Inc.`,
      };
    }
    
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