import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('manufacturer');
  const { login, isLoading } = useAuth();
  const [error, setError] = useState('');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'metamask'>('credentials');
  const [metamaskUsername, setMetamaskUsername] = useState('');

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');

    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      setIsConnecting(false);
      return;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
    } catch (err) {
      setError('Failed to connect to MetaMask. Please try again.');
      console.error(err);
    }
    
    setIsConnecting(false);
  };

  // Disconnect wallet (for the Change button)
  const disconnectWallet = () => {
    setWalletAddress(null);
    // Note: MetaMask doesn't have a proper disconnect method
    // This just removes the address from our state
    // The user would need to disconnect manually from MetaMask if desired
  };

  // Handle MetaMask account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
        }
      });

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        })
        .catch(console.error);
    }

    return () => {
      if (isMetaMaskInstalled()) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (loginMethod === 'credentials') {
      if (!username.trim() || !password.trim()) {
        setError('Username and password are required');
        return;
      }
      
      try {
        await login(username, password, role);
      } catch (err) {
        setError('Invalid username or password');
      }
    } else if (loginMethod === 'metamask') {
      if (!walletAddress) {
        setError('Please connect your MetaMask wallet first');
        return;
      }

      if (!metamaskUsername.trim()) {
        setError('Please enter your name');
        return;
      }

      try {
        // Sign a message to verify ownership of the wallet
        const message = `Login to MedChain as ${metamaskUsername} (${role}): ${new Date().toISOString()}`;
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, walletAddress]
        });

        // Send the signature, address, username and role to your backend
        await login(walletAddress, signature, role, true, metamaskUsername);
      } catch (err) {
        setError('MetaMask authentication failed');
        console.error(err);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="w-full backdrop-blur-lg bg-white/80 border border-gray-100 shadow-lg animate-scale-in">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">MedChain</CardTitle>
          <CardDescription className="text-muted-foreground">
            Secure Pharmaceutical Supply Chain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-2">
            <Button 
              type="button" 
              variant={loginMethod === 'credentials' ? "default" : "outline"} 
              className="w-1/2"
              onClick={() => setLoginMethod('credentials')}
            >
              Credentials
            </Button>
            <Button 
              type="button" 
              variant={loginMethod === 'metamask' ? "default" : "outline"} 
              className="w-1/2"
              onClick={() => setLoginMethod('metamask')}
            >
              MetaMask
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              {loginMethod === 'credentials' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="metamask-username">Wallet Name</Label>
                    <Input
                      id="metamask-username"
                      type="text"
                      placeholder="Enter your name"
                      value={metamaskUsername}
                      onChange={(e) => setMetamaskUsername(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>MetaMask Wallet</Label>
                    {walletAddress ? (
                      <div className="flex items-center justify-between p-2 border rounded-md bg-primary/5">
                        <span className="text-sm font-mono truncate">
                          {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
                        </span>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            disconnectWallet();
                            connectWallet(); // Prompt to connect again
                          }}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        type="button" 
                        className="w-full"
                        onClick={connectWallet}
                        disabled={isConnecting}
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
                          </>
                        ) : (
                          'Connect MetaMask'
                        )}
                      </Button>
                    )}
                    
                    {!isMetaMaskInstalled() && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          MetaMask extension not detected. Please install MetaMask from <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="underline">metamask.io</a>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="manufacturer">Manufacturer</SelectItem>
                      <SelectItem value="distributor">Distributor</SelectItem>
                      <SelectItem value="wholesaler">Wholesaler</SelectItem>
                      <SelectItem value="retailer">Retailer</SelectItem>
                      <SelectItem value="consumer">Consumer</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              {error && <p className="text-sm text-destructive">{error}</p>}
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading || (loginMethod === 'metamask' && !walletAddress)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-xs text-muted-foreground">
          <p className="text-center">Secure and transparent medicine tracking</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;