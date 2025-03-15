
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  FileDigit,
  Link2,
  LucideIcon,
  Package,
  Shield,
  ShieldAlert, 
  Truck 
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const renderStatusBadge = () => {
    switch (batch.status) {
      case 'registered':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="mr-1 h-3 w-3" /> Registered
          </Badge>
        );
      case 'in-transit':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Truck className="mr-1 h-3 w-3" /> In Transit
          </Badge>
        );
      case 'delivered':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> Delivered
          </Badge>
        );
      case 'flagged':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <ShieldAlert className="mr-1 h-3 w-3" /> Flagged
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderBlockchainIndicator = () => {
    const verifiedSignatures = batch.signatures.filter(sig => sig.isVerified).length;
    const totalRequired = 4;
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

  const BlockchainStat = ({
    icon: Icon,
    label,
    value
  }: {
    icon: LucideIcon;
    label: string;
    value: string | number;
  }) => (
    <div className="flex items-center gap-1">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{batch.medicineName}</CardTitle>
            <CardDescription>Batch ID: {batch.id}</CardDescription>
          </div>
          {renderStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Manufacturing Date</p>
            <p>{format(new Date(batch.manufacturingDate), 'PPP')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Expiry Date</p>
            <p>{format(new Date(batch.expiryDate), 'PPP')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Quantity</p>
            <p>{batch.quantity.toLocaleString()} units</p>
          </div>
          <div>
            <p className="text-muted-foreground">Signatures</p>
            <p>{batch.signatures.length} of 4</p>
          </div>
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
          {renderBlockchainIndicator()}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex gap-2 w-full">
          {type === 'sign' && onSign && (
            <Button onClick={onSign} className="flex-1">
              Sign Batch
            </Button>
          )}
          
          {type === 'verify' && onView && (
            <Button onClick={onView} variant="outline" className="flex-1">
              Verify Details
            </Button>
          )}
          
          {type === 'default' && (
            <>
              {onView && (
                <Button onClick={onView} variant="outline" className="flex-1">
                  View Details
                </Button>
              )}
              
              {onReport && batch.status !== 'flagged' && (
                <Button onClick={onReport} variant="destructive" className="flex-1">
                  Report Issue
                </Button>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BatchCard;
