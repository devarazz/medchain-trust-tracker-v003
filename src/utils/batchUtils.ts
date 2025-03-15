
import { Batch, Notification } from '@/types/batch';
import { UserRole } from '@/contexts/AuthContext';

export const getVerifiedBatches = (
  batches: Batch[], 
  user: { role: UserRole; name: string } | null
): Batch[] => {
  if (!user) return [];
  
  if (user.role === 'manufacturer') {
    return batches.filter(batch => batch.manufacturerName === user.name);
  }
  
  const roleOrder: UserRole[] = ['manufacturer', 'wholesaler', 'distributor', 'retailer', 'consumer'];
  const userRoleIndex = roleOrder.indexOf(user.role);
  
  if (userRoleIndex <= 0) return [];
  
  const previousRole = roleOrder[userRoleIndex - 1];
  
  return batches.filter(batch => 
    batch.signatures.some(sig => sig.role === previousRole) && 
    !batch.signatures.some(sig => sig.role === user.role)
  );
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

export const generateBatchId = (): string => {
  return `BATCH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
};
