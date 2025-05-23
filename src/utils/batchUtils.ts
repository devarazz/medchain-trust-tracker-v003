
import { Batch, Notification, Signature } from '@/types/batch';
import { UserRole } from '@/contexts/AuthContext';

export const generateBatchId = (): string => {
  return `BATCH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
};

export const createNewBatch = (
  batchData: Omit<Batch, 'id' | 'createdAt' | 'signatures' | 'status'>,
  userName: string,
  organization: string | undefined
): Batch => {
  return {
    ...batchData,
    id: generateBatchId(),
    createdAt: new Date().toISOString(),
    signatures: [
      {
        role: 'manufacturer' as UserRole,
        timestamp: new Date().toISOString(),
        organizationName: organization || 'Unknown Organization',
        userName,
        isVerified: true
      }
    ],
    status: 'registered'
  };
};

export const createNotification = (message: string, batchId?: string): Notification => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    message,
    timestamp: new Date().toISOString(),
    read: false,
    batchId
  };
};

export const getVerifiedBatches = (
  batches: Batch[],
  user: { role: UserRole; name: string } | null
): Batch[] => {
  if (!user) return [];
  
  if (user.role === 'manufacturer') {
    return batches.filter(batch => batch.manufacturerName === user.name);
  }
  
  const roleOrder: UserRole[] = ['manufacturer', 'distributor', 'wholesaler', 'retailer', 'consumer'];
  const userRoleIndex = roleOrder.indexOf(user.role);
  
  if (userRoleIndex <= 0) return [];
  
  const previousRole = roleOrder[userRoleIndex - 1];
  
  return batches.filter(batch => 
    batch.signatures.some(sig => sig.role === previousRole) && 
    !batch.signatures.some(sig => sig.role === user.role)
  );
};
