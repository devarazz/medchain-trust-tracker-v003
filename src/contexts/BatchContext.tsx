
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { Batch, BatchContextType, Notification } from '@/types/batch';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  getBatchById,
  createBatch,
  signBatchById,
  reportFakeBatchById,
  createNotification,
  getVerifiedBatchesByRole
} from '@/services/batchService';

// Create context with default undefined value
const BatchContext = createContext<BatchContextType | undefined>(undefined);

export const BatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [batches, setBatches] = useLocalStorage<Batch[]>('medchain_batches', []);
  const [batchNotifications, setBatchNotifications] = useLocalStorage<Notification[]>('medchain_notifications', []);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  
  const registerBatch = (batchData: Omit<Batch, 'id' | 'createdAt' | 'signatures' | 'status'>) => {
    if (!user) return;
    
    const newBatch = createBatch(batchData, user.name, user.organization);
    setBatches([...batches, newBatch]);
    
    // Add notification
    addNotification(`New batch ${newBatch.id} for ${newBatch.medicineName} registered`, newBatch.id);
  };
  
  const signBatch = (batchId: string) => {
    if (!user) return;
    
    const updatedBatches = signBatchById(batches, batchId, user.role, user.name, user.organization);
    setBatches(updatedBatches);
    
    // Check if a batch was actually signed (by comparing arrays)
    const wasSigned = JSON.stringify(batches) !== JSON.stringify(updatedBatches);
    if (wasSigned) {
      // Add notification
      addNotification(`Batch ${batchId} signed by ${user.role} ${user.name}`, batchId);
    }
  };
  
  const getBatch = (batchId: string) => {
    return getBatchById(batches, batchId);
  };
  
  const reportFakeBatch = (batchId: string, reason: string) => {
    if (!user) return;
    
    setBatches(reportFakeBatchById(batches, batchId));
    
    // Add notification about the reported fake batch
    addNotification(`⚠️ Batch ${batchId} reported as potentially fake by ${user.role} ${user.name}. Reason: ${reason}`, batchId);
  };
  
  const addNotification = (message: string, batchId?: string) => {
    const newNotification = createNotification(message, batchId);
    setBatchNotifications([newNotification, ...batchNotifications]);
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
        registerBatch,
        signBatch,
        getBatch,
        reportFakeBatch,
        verifiedBatches: getVerifiedBatchesByRole(batches, user?.role, user?.name),
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

export const useBatch = () => {
  const context = useContext(BatchContext);
  if (context === undefined) {
    throw new Error('useBatch must be used within a BatchProvider');
  }
  return context;
};

// Re-export types for convenience
export type { Batch, Signature, Notification } from '@/types/batch';
