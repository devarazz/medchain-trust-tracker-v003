
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, UserRole } from './AuthContext';

export interface Signature {
  role: UserRole;
  timestamp: string;
  organizationName: string;
  userName: string;
  isVerified: boolean;
}

export interface Batch {
  id: string;
  medicineName: string;
  manufacturingDate: string;
  expiryDate: string;
  quantity: number;
  manufacturerName: string;
  createdAt: string;
  signatures: Signature[];
  status: 'registered' | 'in-transit' | 'delivered' | 'flagged';
}

interface BatchContextType {
  batches: Batch[];
  registerBatch: (batch: Omit<Batch, 'id' | 'createdAt' | 'signatures' | 'status'>) => void;
  signBatch: (batchId: string) => void;
  getBatch: (batchId: string) => Batch | undefined;
  reportFakeBatch: (batchId: string, reason: string) => void;
  verifiedBatches: Batch[];
  batchNotifications: Notification[];
  clearBatchNotification: (id: string) => void;
  selectedBatch: Batch | null; // Add selectedBatch property
  setSelectedBatch: (batch: Batch | null) => void; // Add setter function
}

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  batchId?: string;
}

const BatchContext = createContext<BatchContextType | undefined>(undefined);

export const BatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batchNotifications, setBatchNotifications] = useState<Notification[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null); // Add state for selectedBatch
  
  // Load stored batches from localStorage
  useEffect(() => {
    const storedBatches = localStorage.getItem('medchain_batches');
    if (storedBatches) {
      setBatches(JSON.parse(storedBatches));
    }
    
    const storedNotifications = localStorage.getItem('medchain_notifications');
    if (storedNotifications) {
      setBatchNotifications(JSON.parse(storedNotifications));
    }
  }, []);
  
  // Save batches to localStorage when they change
  useEffect(() => {
    if (batches.length > 0) {
      localStorage.setItem('medchain_batches', JSON.stringify(batches));
    }
  }, [batches]);
  
  // Save notifications to localStorage when they change
  useEffect(() => {
    if (batchNotifications.length > 0) {
      localStorage.setItem('medchain_notifications', JSON.stringify(batchNotifications));
    }
  }, [batchNotifications]);

  const registerBatch = (batchData: Omit<Batch, 'id' | 'createdAt' | 'signatures' | 'status'>) => {
    if (!user) return;
    
    const newBatch: Batch = {
      ...batchData,
      id: `BATCH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      signatures: [
        {
          role: 'manufacturer',
          timestamp: new Date().toISOString(),
          organizationName: user.organization || 'Unknown Organization',
          userName: user.name,
          isVerified: true
        }
      ],
      status: 'registered'
    };
    
    setBatches(prevBatches => [...prevBatches, newBatch]);
    
    // Add notification
    addNotification(`New batch ${newBatch.id} for ${newBatch.medicineName} registered`, newBatch.id);
  };
  
  const signBatch = (batchId: string) => {
    if (!user) return;
    
    setBatches(prevBatches => 
      prevBatches.map(batch => {
        if (batch.id === batchId) {
          // Check if this role has already signed
          const hasAlreadySigned = batch.signatures.some(sig => sig.role === user.role);
          
          if (!hasAlreadySigned) {
            const newSignature: Signature = {
              role: user.role,
              timestamp: new Date().toISOString(),
              organizationName: user.organization || 'Unknown Organization',
              userName: user.name,
              isVerified: true
            };
            
            // Add notification
            addNotification(`Batch ${batchId} signed by ${user.role} ${user.name}`, batchId);
            
            return {
              ...batch,
              signatures: [...batch.signatures, newSignature],
              status: batch.signatures.length + 1 >= 4 ? 'delivered' : 'in-transit'
            };
          }
        }
        return batch;
      })
    );
  };
  
  const getBatch = (batchId: string) => {
    return batches.find(batch => batch.id === batchId);
  };
  
  const reportFakeBatch = (batchId: string, reason: string) => {
    if (!user) return;
    
    setBatches(prevBatches => 
      prevBatches.map(batch => {
        if (batch.id === batchId) {
          // Add notification about the reported fake batch
          addNotification(`⚠️ Batch ${batchId} reported as potentially fake by ${user.role} ${user.name}. Reason: ${reason}`, batchId);
          
          return {
            ...batch,
            status: 'flagged'
          };
        }
        return batch;
      })
    );
  };
  
  const addNotification = (message: string, batchId?: string) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      timestamp: new Date().toISOString(),
      read: false,
      batchId
    };
    
    setBatchNotifications(prev => [newNotification, ...prev]);
  };
  
  const clearBatchNotification = (id: string) => {
    setBatchNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Filter batches based on user role
  const getVerifiedBatches = () => {
    if (!user) return [];
    
    // Manufacturer can see all batches they created
    if (user.role === 'manufacturer') {
      return batches.filter(batch => batch.manufacturerName === user.name);
    }
    
    // Other roles can see batches that have been signed by the previous role in the chain
    const roleOrder: UserRole[] = ['manufacturer', 'wholesaler', 'distributor', 'retailer', 'consumer'];
    const userRoleIndex = roleOrder.indexOf(user.role);
    
    if (userRoleIndex <= 0) return [];
    
    const previousRole = roleOrder[userRoleIndex - 1];
    
    return batches.filter(batch => 
      batch.signatures.some(sig => sig.role === previousRole) && 
      !batch.signatures.some(sig => sig.role === user.role)
    );
  };
  
  return (
    <BatchContext.Provider
      value={{
        batches,
        registerBatch,
        signBatch,
        getBatch,
        reportFakeBatch,
        verifiedBatches: getVerifiedBatches(),
        batchNotifications,
        clearBatchNotification,
        selectedBatch, // Provide selectedBatch in context
        setSelectedBatch, // Provide setSelectedBatch in context
      }}
    >
      {children}
    </BatchContext.Provider>
  );
};

export const useBatch = () => {
  const context = useContext(BatchContext);
  if (context === undefined) {
    throw new Error('useBatch must be used within a BatchProvider');
  }
  return context;
};
