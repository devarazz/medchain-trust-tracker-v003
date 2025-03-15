
import React from 'react';
import { Button } from '@/components/ui/button';

interface BatchActionsProps {
  type: 'default' | 'verify' | 'sign';
  batchId: string;
  status: string;
  onView?: () => void;
  onSign?: () => void;
  onReport?: () => void;
}

const BatchActions: React.FC<BatchActionsProps> = ({ 
  type, 
  batchId, 
  status, 
  onView, 
  onSign, 
  onReport 
}) => {
  if (type === 'sign' && onSign) {
    return (
      <Button onClick={onSign} className="flex-1">
        Sign Batch
      </Button>
    );
  }
  
  if (type === 'verify' && onView) {
    return (
      <Button onClick={onView} variant="outline" className="flex-1">
        Verify Details
      </Button>
    );
  }
  
  if (type === 'default') {
    return (
      <>
        {onView && (
          <Button onClick={onView} variant="outline" className="flex-1">
            View Details
          </Button>
        )}
        
        {onReport && status !== 'flagged' && (
          <Button onClick={onReport} variant="destructive" className="flex-1">
            Report Issue
          </Button>
        )}
      </>
    );
  }
  
  return null;
};

export default BatchActions;
