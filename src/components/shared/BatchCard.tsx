
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Batch } from '@/types/batch';
import { format } from 'date-fns';
import { FileDigit, Link2 } from 'lucide-react';

import BatchStatusBadge from './BatchStatusBadge';
import BlockchainVerificationIndicator from './BlockchainVerificationIndicator';
import BlockchainStat from './BlockchainStat';
import BatchActions from './BatchActions';
import BatchInfoItem from './BatchInfoItem';

interface BatchCardProps {
  batch: Batch;
  onView?: () => void;
  onSign?: () => void;
  onReport?: () => void;
  type?: 'default' | 'verify' | 'sign';
}

const BatchCard: React.FC<BatchCardProps> = ({ 
  batch, 
  onView, 
  onSign, 
  onReport,
  type = 'default'
}) => {
  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{batch.medicineName}</CardTitle>
            <CardDescription>Batch ID: {batch.id}</CardDescription>
          </div>
          <BatchStatusBadge status={batch.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <BatchInfoItem 
            label="Manufacturing Date" 
            value={format(new Date(batch.manufacturingDate), 'PPP')} 
          />
          <BatchInfoItem 
            label="Expiry Date" 
            value={format(new Date(batch.expiryDate), 'PPP')} 
          />
          <BatchInfoItem 
            label="Quantity" 
            value={`${batch.quantity.toLocaleString()} units`} 
          />
          <BatchInfoItem 
            label="Signatures" 
            value={`${batch.signatures.length} of 4`} 
          />
        </div>
        
        <div className="flex flex-col gap-1 mt-3">
          <div className="grid grid-cols-2 gap-1.5">
            <BlockchainStat 
              icon={FileDigit} 
              label="Ledger ID" 
              value={`#${batch.id.substring(batch.id.length - 5)}`} 
            />
            <BlockchainStat 
              icon={Link2} 
              label="Block Height" 
              value={Math.floor(Math.random() * 1000000)} 
            />
          </div>
          <BlockchainVerificationIndicator signatures={batch.signatures} />
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex gap-2 w-full">
          <BatchActions 
            type={type} 
            batchId={batch.id}
            status={batch.status}
            onView={onView} 
            onSign={onSign} 
            onReport={onReport} 
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default BatchCard;
