
import { useContext } from 'react';
import { BatchContext } from '@/contexts/BatchContext';

export const useBatch = () => {
  const context = useContext(BatchContext);
  if (context === undefined) {
    throw new Error('useBatch must be used within a BatchProvider');
  }
  return context;
};
