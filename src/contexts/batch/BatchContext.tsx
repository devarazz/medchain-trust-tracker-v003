
import { createContext } from 'react';
import { BatchContextType } from '@/types/batch';

export const BatchContext = createContext<BatchContextType | undefined>(undefined);
