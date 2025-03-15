
import { useContext } from 'react';
import { BatchContext } from './BatchContext';
import { BatchContextType } from '@/types/batch';

export const useBatch = (): BatchContextType => {
  const context = useContext(BatchContext);
  if (context === undefined) {
    throw new Error('useBatch must be used within a BatchProvider');
  }
  return context;
};
