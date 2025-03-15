
import React, { createContext } from 'react';
import { BatchContextType } from '@/types/batch';
import { BatchProvider as InternalBatchProvider } from '@/providers/BatchProvider';
import { useBatch as useInternalBatch } from '@/hooks/use-batch';

// Create the context with undefined as default
export const BatchContext = createContext<BatchContextType | undefined>(undefined);

// Re-export the provider component
export const BatchProvider = InternalBatchProvider;

// Re-export the hook
export const useBatch = useInternalBatch;

// Re-export types
export type { Batch, Signature, Notification } from '@/types/batch';
