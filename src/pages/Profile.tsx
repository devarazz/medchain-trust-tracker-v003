
import React from 'react';
import UserProfile from '@/components/auth/UserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary font-medium">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="container mx-auto py-6 px-4 animate-fade-in">
      <UserProfile />
    </div>
  );
};

export default Profile;
