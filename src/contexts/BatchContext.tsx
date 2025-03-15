
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Batch, BatchContextType, Notification, Signature } from '@/types/batch';
import { createNotification, generateBatchId, getVerifiedBatches } from '@/utils/batchUtils';

const BatchContext = createContext<BatchContextType | undefined>(undefined);

export const BatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [batchNotifications, setBatchNotifications] = useState<Notification[]>([]);
  
  // Load data from localStorage
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
  
  // Save batches to localStorage when updated
  useEffect(() => {
    if (batches.length > 0) {
      localStorage.setItem('medchain_batches', JSON.stringify(batches));
    }
  }, [batches]);
  
  // Save notifications to localStorage when updated
  useEffect(() => {
    if (batchNotifications.length > 0) {
      localStorage.setItem('medchain_notifications', JSON.stringify(batchNotifications));
    }
  }, [batchNotifications]);

  const addNotification = (message: string, batchId?: string) => {
    const newNotification = createNotification(message, batchId);
    setBatchNotifications(prev => [newNotification, ...prev]);
  };
  
  const registerBatch = (batchData: Omit<Batch, 'id' | 'createdAt' | 'signatures' | 'status'>) => {
    if (!user) return;
    
    const newBatch: Batch = {
      ...batchData,
      id: generateBatchId(),
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
            const newSignature: Signature = {
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
  
  const clearBatchNotification = (id: string) => {
    setBatchNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  return (
    <BatchContext.Provider
      value={{
        batches,
        selectedBatch,
        setSelectedBatch,
        registerBatch,
        signBatch,
        getBatch,
        reportFakeBatch,
        verifiedBatches: getVerifiedBatches(batches, user),
        batchNotifications,
        clearBatchNotification,
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

export type { Batch, Signature, Notification } from '@/types/batch';
