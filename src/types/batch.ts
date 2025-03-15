
import { UserRole } from '@/contexts/AuthContext';

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

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  batchId?: string;
}

export interface BatchContextType {
  batches: Batch[];
  registerBatch: (batch: Omit<Batch, 'id' | 'createdAt' | 'signatures' | 'status'>) => void;
  signBatch: (batchId: string) => void;
  getBatch: (batchId: string) => Batch | undefined;
  reportFakeBatch: (batchId: string, reason: string) => void;
  verifiedBatches: Batch[];
  batchNotifications: Notification[];
  clearBatchNotification: (id: string) => void;
  selectedBatch: Batch | null;
  setSelectedBatch: React.Dispatch<React.SetStateAction<Batch | null>>;
}
