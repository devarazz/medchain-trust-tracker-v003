
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  User, 
  Mail, 
  Building, 
  Shield, 
  LogOut, 
  Edit2, 
  KeyRound,
  Loader2,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState('user@example.com'); // Placeholder email
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!user) return null;

  const handleEditToggle = () => {
    if (isEditing) {
      // In a real app, this would call an API to update the profile
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setIsEditing(false);
        
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
      }, 1000);
    } else {
      setIsEditing(true);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    setPasswordError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setUpdateSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setUpdateSuccess(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsPasswordDialogOpen(false);
        
        toast({
          title: "Password updated",
          description: "Your password has been changed successfully.",
        });
      }, 1500);
    }, 1500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadgeColor = () => {
    switch(user.role) {
      case 'manufacturer': return 'bg-blue-100 text-blue-800';
      case 'wholesaler': return 'bg-green-100 text-green-800';
      case 'distributor': return 'bg-purple-100 text-purple-800'; 
      case 'retailer': return 'bg-orange-100 text-orange-800';
      case 'consumer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">My Profile</CardTitle>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User avatar/photo placeholder */}
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          {/* User information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="name">Full Name</Label>
              </div>
              {isEditing ? (
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              ) : (
                <p className="text-lg font-medium">{user.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label>Email</Label>
              </div>
              {isEditing ? (
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <p>{email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label>Role</Label>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor()}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
            </div>
            
            {user.organization && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Label>Organization</Label>
                </div>
                <p>{user.organization}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleEditToggle}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEditing ? (
              <>Save Changes</>
            ) : (
              <><Edit2 className="h-4 w-4 mr-2" /> Edit Profile</>
            )}
          </Button>
          
          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <KeyRound className="h-4 w-4 mr-2" /> Change Password
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Create a new password for your account.
                </DialogDescription>
              </DialogHeader>
              
              {updateSuccess ? (
                <div className="flex flex-col items-center justify-center py-4 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-center font-medium">Password updated successfully!</p>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  {passwordError && (
                    <p className="text-sm text-destructive">{passwordError}</p>
                  )}
                  
                  <DialogFooter>
                    <Button 
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" /> 
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserProfile;
