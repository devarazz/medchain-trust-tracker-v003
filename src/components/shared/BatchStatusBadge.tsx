
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  Truck 
} from 'lucide-react';

interface BatchStatusBadgeProps {
  status: 'registered' | 'in-transit' | 'delivered' | 'flagged';
}

const BatchStatusBadge: React.FC<BatchStatusBadgeProps> = ({ status }) => {
  switch (status) {
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

export default BatchStatusBadge;
