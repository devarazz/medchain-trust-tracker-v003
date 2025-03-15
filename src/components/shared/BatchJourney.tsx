
import React from 'react';
import { Batch } from '@/types/batch';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Factory, Package, ShoppingBag, Truck, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface BatchJourneyProps {
  batch: Batch;
}

const BatchJourney: React.FC<BatchJourneyProps> = ({ batch }) => {
  const roleIcons = {
    manufacturer: <Factory className="h-5 w-5" />,
    wholesaler: <Package className="h-5 w-5" />,
    distributor: <Truck className="h-5 w-5" />,
    retailer: <ShoppingBag className="h-5 w-5" />,
    consumer: <User className="h-5 w-5" />,
  };
  
  const handleDownloadCertificate = () => {
    // In a real app, this would generate a proper certificate
    const certificateData = {
      batchId: batch.id,
      medicineName: batch.medicineName,
      manufacturingDate: batch.manufacturingDate,
      expiryDate: batch.expiryDate,
      manufacturerName: batch.manufacturerName,
      signatures: batch.signatures,
    };
    
    const certificateJSON = JSON.stringify(certificateData, null, 2);
    const blob = new Blob([certificateJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${batch.id}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Medicine Name</p>
              <p className="font-medium">{batch.medicineName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Batch ID</p>
              <p className="font-medium">{batch.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Manufacturing Date</p>
              <p className="font-medium">{format(new Date(batch.manufacturingDate), 'PPP')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Expiry Date</p>
              <p className="font-medium">{format(new Date(batch.expiryDate), 'PPP')}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Batch Journey</h4>
            <div className="space-y-4 relative">
              {/* Vertical line connecting the journey steps */}
              <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-primary/20" />
              
              {batch.signatures.map((signature, index) => (
                <div key={index} className="flex items-start gap-3 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {roleIcons[signature.role]}
                  </div>
                  <div className="space-y-1 pt-1">
                    <p className="font-medium capitalize">{signature.role}</p>
                    <p className="text-sm text-muted-foreground">{signature.organizationName}</p>
                    <p className="text-xs text-muted-foreground">
                      Signed by {signature.userName} on {format(new Date(signature.timestamp), 'PPP p')}
                    </p>
                  </div>
                </div>
              ))}
              
              {batch.signatures.length < 4 && (
                <div className="flex items-start gap-3 opacity-40">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted flex items-center justify-center text-muted-foreground shrink-0">
                    ?
                  </div>
                  <div className="space-y-1 pt-1">
                    <p className="font-medium">Pending verification</p>
                    <p className="text-sm text-muted-foreground">
                      {4 - batch.signatures.length} more {4 - batch.signatures.length === 1 ? 'step' : 'steps'} remaining
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          <Button 
            onClick={handleDownloadCertificate} 
            variant="outline" 
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" /> Download Certificate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchJourney;
