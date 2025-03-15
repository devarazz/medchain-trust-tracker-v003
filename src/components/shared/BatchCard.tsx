
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
import { CheckCircle, Clock, ShieldAlert, Truck } from 'lucide-react';

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
