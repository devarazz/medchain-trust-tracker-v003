
import React from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlockchainVerificationIndicatorProps {
  signatures: { isVerified: boolean }[];
  totalRequired?: number;
}

const BlockchainVerificationIndicator: React.FC<BlockchainVerificationIndicatorProps> = ({ 
  signatures, 
  totalRequired = 4 
}) => {
  const verifiedSignatures = signatures.filter(sig => sig.isVerified).length;
  const percentage = (verifiedSignatures / totalRequired) * 100;
  
  return (
    <div className="flex items-center mt-2 pt-2 border-t border-border">
      <div className="flex gap-1 items-center mr-2">
        <Shield className={cn(
          "h-4 w-4",
          percentage === 100 ? "text-green-500" : "text-amber-500"
        )} />
        <span className="text-xs font-medium">Blockchain Verified</span>
      </div>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div 
          className={cn(
            "h-2 rounded-full",
            percentage === 100 ? "bg-green-500" : "bg-amber-500"
          )}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default BlockchainVerificationIndicator;
