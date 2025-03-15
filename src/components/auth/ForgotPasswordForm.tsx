
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Loader2, KeyRound, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleEmailReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // In a real app, this would call a password reset API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResetSent(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions",
      });
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // In a real app, this would send a verification code to the phone
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResetSent(true);
      toast({
        title: "Verification code sent",
        description: "Check your phone for the code to reset your password",
      });
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full backdrop-blur-lg bg-white/80 border border-gray-100 shadow-lg animate-scale-in">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
        <CardDescription className="text-muted-foreground">
          {resetSent ? 'Check your inbox for reset instructions' : 'Choose how you want to reset your password'}
        </CardDescription>
      </CardHeader>
      
      {!resetSent ? (
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleEmailReset} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {error && <p className="text-sm text-destructive">{error}</p>}
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="phone">
              <form onSubmit={handlePhoneReset} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {error && <p className="text-sm text-destructive">{error}</p>}
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      ) : (
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {email ? 
              `We've sent reset instructions to ${email}` : 
              `We've sent a verification code to your phone`
            }
          </p>
          <Button 
            variant="outline" 
            onClick={() => setResetSent(false)}
            className="mt-2"
          >
            Try Another Method
          </Button>
        </CardContent>
      )}
      
      <CardFooter className="flex flex-col items-center justify-center space-y-2 text-sm text-muted-foreground">
        <p>Remember your password?{' '}
          <Link to="/" className="text-primary font-medium hover:underline">
            Sign In
          </Link>
        </p>
        <p>Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordForm;
