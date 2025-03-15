import { Batch, Notification, Signature } from '@/types/batch';
import { UserRole } from '@/contexts/AuthContext';

// Get batch by ID
export const getBatchById = (batches: Batch[], batchId: string): Batch | undefined => {
  return batches.find(batch => batch.id === batchId);
};

// Create a new batch
export const createBatch = (
  batchData: Omit<Batch, 'id' | 'createdAt' | 'signatures' | 'status'>,
  userName: string,
  organization: string | undefined
): Batch => {
  return {
    ...batchData,
    id: `BATCH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    signatures: [
      {
        role: 'manufacturer',
        timestamp: new Date().toISOString(),
        organizationName: organization || 'Unknown Organization',
        userName,
        isVerified: true
      }
    ],
    status: 'registered'
  };
};

// Sign a batch
export const signBatchById = (
  batches: Batch[],
  batchId: string,
  role: UserRole,
  userName: string,
  organization: string | undefined
): Batch[] => {
  return batches.map(batch => {
    if (batch.id === batchId) {
      // Check if this role has already signed
      const hasAlreadySigned = batch.signatures.some(sig => sig.role === role);
      
      if (!hasAlreadySigned) {
        const newSignature: Signature = {
          role,
          timestamp: new Date().toISOString(),
          organizationName: organization || 'Unknown Organization',
          userName,
          isVerified: true
        };
        
        return {
          ...batch,
          signatures: [...batch.signatures, newSignature],
          status: batch.signatures.length + 1 >= 4 ? 'delivered' : 'in-transit'
        };
      }
    }
    return batch;
  });
};

// Report a fake batch
export const reportFakeBatchById = (batches: Batch[], batchId: string): Batch[] => {
  return batches.map(batch => {
    if (batch.id === batchId) {
      return {
        ...batch,
        status: 'flagged'
      };
    }
    return batch;
  });
};

// Create a new notification
export const createNotification = (message: string, batchId?: string): Notification => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    message,
    timestamp: new Date().toISOString(),
    read: false,
    batchId
  };
};

// Filter batches based on user role
export const getVerifiedBatchesByRole = (batches: Batch[], role: UserRole | undefined, userName: string | undefined): Batch[] => {
  if (!role) return [];
  
  // Manufacturer can see all batches they created
  if (role === 'manufacturer' && userName) {
    return batches.filter(batch => batch.manufacturerName === userName);
  }
  
  // Other roles can see batches that have been signed by the previous role in the chain
  const roleOrder: UserRole[] = ['manufacturer', 'wholesaler', 'distributor', 'retailer', 'consumer'];
  const userRoleIndex = roleOrder.indexOf(role);
  
  if (userRoleIndex <= 0) return [];
  
  const previousRole = roleOrder[userRoleIndex - 1];
  
  return batches.filter(batch => 
    batch.signatures.some(sig => sig.role === previousRole) && 
    !batch.signatures.some(sig => sig.role === role)
  );
};
