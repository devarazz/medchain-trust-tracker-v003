
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BatchContext } from '@/contexts/BatchContext';
import { Batch, Notification } from '@/types/batch';

export const BatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batchNotifications, setBatchNotifications] = useState<Notification[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  
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
  
  useEffect(() => {
    if (batches.length > 0) {
      localStorage.setItem('medchain_batches', JSON.stringify(batches));
    }
  }, [batches]);
  
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
    
    addNotification(`New batch ${newBatch.id} for ${newBatch.medicineName} registered`, newBatch.id);
  };
  
  const signBatch = (batchId: string) => {
    if (!user) return;
    
    setBatches(prevBatches => 
      prevBatches.map(batch => {
        if (batch.id === batchId) {
          const hasAlreadySigned = batch.signatures.some(sig => sig.role === user.role);
          
          if (!hasAlreadySigned) {
            const newSignature = {
              role: user.role,
              timestamp: new Date().toISOString(),
              organizationName: user.organization || 'Unknown Organization',
              userName: user.name,
              isVerified: true
            };
            
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
  
  const getVerifiedBatches = () => {
    if (!user) return [];
    
    if (user.role === 'manufacturer') {
      return batches.filter(batch => batch.manufacturerName === user.name);
    }
    
    const roleOrder = ['manufacturer', 'wholesaler', 'distributor', 'retailer', 'consumer'];
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
        selectedBatch,
        setSelectedBatch,
      }}
    >
      {children}
    </BatchContext.Provider>
  );
};
