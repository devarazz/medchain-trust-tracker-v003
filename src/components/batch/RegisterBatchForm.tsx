
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useBatch } from '@/contexts/BatchContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const RegisterBatchForm: React.FC = () => {
  const { user } = useAuth();
  const { registerBatch,refreshBatches } = useBatch();
  const { toast } = useToast();
  
  const [medicineName, setMedicineName] = useState('');
  const [manufacturingDate, setManufacturingDate] = useState<Date | undefined>(new Date());
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    new Date(new Date().setFullYear(new Date().getFullYear() + 2))
  );
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medicineName || !manufacturingDate || !expiryDate || !quantity) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (new Date(expiryDate) <= new Date(manufacturingDate)) {
      toast({
        title: "Invalid dates",
        description: "Expiry date must be after manufacturing date.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      registerBatch({
        medicineName,
        manufacturingDate: manufacturingDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        quantity: Number(quantity),
        manufacturerName: user?.name || 'Unknown'
      });
      
      setMedicineName('');
      setManufacturingDate(new Date());
      setExpiryDate(new Date(new Date().setFullYear(new Date().getFullYear() + 2)));
      setQuantity('');
      
      toast({
        title: "Success",
        description: "Batch registered successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register batch.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      refreshBatches()
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register New Batch</CardTitle>
        <CardDescription>Add a new medicine batch to the blockchain</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="medicineName">Medicine Name</Label>
            <Input
              id="medicineName"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="Enter medicine name"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !manufacturingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {manufacturingDate ? (
                      format(manufacturingDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={manufacturingDate}
                    onSelect={setManufacturingDate}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? (
                      format(expiryDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (units)</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="manufacturer">Manufacturer Name</Label>
            <Input
              id="manufacturer"
              value={user?.name || ''}
              readOnly
              disabled
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
              </>
            ) : (
              'Register Batch'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterBatchForm;
