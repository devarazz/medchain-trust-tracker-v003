
import React from 'react';
import { Batch } from '@/types/batch';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Factory, 
  FileDigit, 
  Link, 
  Lock, 
  Package, 
  ShieldCheck, 
  ShoppingBag, 
  Truck, 
  User 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';

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
  
  // const handleDownloadCertificate = () => {
  //   // In a real app, this would generate a proper certificate
  //   const certificateData = {
  //     batchId: batch.id,
  //     medicineName: batch.medicineName,
  //     manufacturingDate: batch.manufacturingDate,
  //     expiryDate: batch.expiryDate,
  //     manufacturerName: batch.manufacturerName,
  //     signatures: batch.signatures,
  //   };
    
  //   const certificateJSON = JSON.stringify(certificateData, null, 2);
  //   const blob = new Blob([certificateJSON], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
    
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `certificate-${batch.id}.json`;
  //   a.click();
    
  //   URL.revokeObjectURL(url);
  // };

  
// Your component code...

const handleDownloadCertificate = () => {
  // Show loading toast

  // Import libraries dynamically
  Promise.all([
    import('jspdf'),
    import('qrcode')
  ]).then(([{ default: jsPDF }, QRCode]) => {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Certificate data
    const certificateData = {
      batchId: batch.id,
      medicineName: batch.medicineName,
      manufacturingDate: new Date(batch.manufacturingDate).toLocaleDateString(),
      expiryDate: new Date(batch.expiryDate).toLocaleDateString(),
      manufacturerName: batch.manufacturerName,
      signatures: batch.signatures,
    };

    // Add border to the certificate
    doc.setDrawColor(0, 0, 128);
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277);
    
    // Add decorative header
    doc.setFillColor(0, 0, 128);
    doc.rect(10, 10, 190, 25, 'F');
    
    // Add title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Blockchain Verified Medicine Certificate', 105, 25, { align: 'center' });
    
    // Add MedChain logo placeholder
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.circle(30, 22, 8, 'FD');
    doc.setTextColor(0, 0, 128);
    doc.setFontSize(10);
    doc.text('MC', 30, 25, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Add content
    doc.setFontSize(14);
    doc.text('Product Information', 20, 50);
    
    doc.setFontSize(12);
    doc.text(`Batch ID: ${certificateData.batchId}`, 20, 60);
    doc.text(`Medicine: ${certificateData.medicineName}`, 20, 70);
    doc.text(`Manufacturing Date: ${certificateData.manufacturingDate}`, 20, 80);
    doc.text(`Expiry Date: ${certificateData.expiryDate}`, 20, 90);
    doc.text(`Manufacturer: ${certificateData.manufacturerName}`, 20, 100);
    
    // Add blockchain verification section
    doc.setFontSize(14);
    doc.text('Blockchain Verification', 20, 120);
    
    doc.setFontSize(12);
    // doc.text(`Blockchain Status: ${certificateData.blockchainVerified ? 'Verified' : 'Pending'}`, 20, 130);
    
    // Format the creator address for better display
    // const shortAddress = `${certificateData.creatorAddress.substring(0, 8)}...${certificateData.creatorAddress.substring(certificateData.creatorAddress.length - 6)}`;
    // doc.text(`Creator Address: ${shortAddress}`, 20, 140);
    
    // Add signature information if available
    if (certificateData.signatures && certificateData.signatures.length > 0) {
      doc.setFontSize(14);
      doc.text('Supply Chain Signatures', 20, 160);
      
      doc.setFontSize(12);
      certificateData.signatures.forEach((signature, index) => {
        const role = signature.role.charAt(0).toUpperCase() + signature.role.slice(1);
        const date = new Date(signature.timestamp).toLocaleDateString();
        doc.text(`${role}: ${signature.userName} (${signature.organizationName})`, 30, 170 + (index * 10));
        doc.text(`Verified on: ${date}`, 40, 175 + (index * 10));
      });
    }

    // Generate QR code for batch ID
    QRCode.toDataURL(certificateData.batchId, { errorCorrectionLevel: 'H' })
      .then(url => {
        // Add QR code to the PDF
        doc.addImage(url, 'PNG', 75, 210, 60, 60);
        
        // Add QR code caption
        doc.setFontSize(10);
        doc.text('Scan to verify authenticity', 105, 275, { align: 'center' });
        
        // Add footer with date and verification instruction
        const today = new Date().toLocaleDateString();
        doc.setFontSize(8);
        doc.text(`Certificate generated on ${today}`, 105, 280, { align: 'center' });
        doc.text('Verify this certificate at medchain.example.com', 105, 285, { align: 'center' });
        
        // Save the PDF
        doc.save(`certificate-${certificateData.batchId}.pdf`);
        
        // Show success toast
        // toast.dismiss();
        // toast.success("Certificate downloaded successfully");
      })
      .catch(err => {
        console.error("Error generating QR code:", err);
        // toast.dismiss();
        // toast.error("Failed to generate QR code for certificate");
      });
  }).catch(err => {
    console.error("Error loading libraries:", err);
    // toast.dismiss();
    // toast.error("Failed to generate certificate");
  });
};
  
  // Generate a fake blockchain hash for display
  const generateBlockchainHash = (batchId: string) => {
    return `0x${batchId.split('').map(c => c.charCodeAt(0).toString(16)).join('').substring(0, 12)}...`;
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
          
          <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Blockchain Verification</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Link className="h-3.5 w-3.5" />
                  <span>Transaction Hash</span>
                </div>
                <p className="font-mono text-xs">{generateBlockchainHash(batch.id)}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <FileDigit className="h-3.5 w-3.5" />
                  <span>Block Height</span>
                </div>
                <p className="font-medium">{Math.floor(Math.random() * 1000000)}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Consensus</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-normal text-xs">
                  Verified
                </Badge>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <FileDigit className="h-3.5 w-3.5" />
                  <span>Smart Contract</span>
                </div>
                <p className="font-medium">MedChainTracker</p>
              </div>
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
                    <div className="flex items-center gap-2">
                      <p className="font-medium capitalize">{signature.role}</p>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{signature.organizationName}</p>
                    <p className="text-xs text-muted-foreground">
                      Signed by {signature.userName} on {format(new Date(signature.timestamp), 'PPP p')}
                    </p>
                    <div className="text-xs font-mono text-slate-500 mt-1">
                      Signature: {generateBlockchainHash(signature.userName + signature.timestamp).substring(0, 30)}
                    </div>
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
          
          <div className="space-y-2">
            <Button 
              onClick={handleDownloadCertificate} 
              variant="outline" 
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" /> Download Blockchain Certificate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchJourney;
