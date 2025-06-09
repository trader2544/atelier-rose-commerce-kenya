
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { LogOut, Moon, Sun, Monitor, Download } from 'lucide-react';

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const { isInstallable, installApp } = usePWAInstall();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        email: user?.email || ''
      });
    }
  }, [profile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (!user) {
    return (
      <div className="page-background pt-20 pb-16 flex items-center justify-center">
        <div className="text-center relative z-10">
          <h1 className="text-2xl font-medium text-gray-800 mb-4">Please Sign In</h1>
          <p className="text-gray-600">You need to be signed in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-background pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-light text-gray-800">My Profile</h1>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            size="sm"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        <p className="text-gray-600 mb-6 sm:mb-8">Manage your account information and preferences</p>

        <div className="space-y-4 sm:space-y-6">
          {/* Personal Information */}
          <Card className="luxury-card">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl text-pink-800">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <Label htmlFor="email" className="text-sm">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    className="mt-1 bg-gray-100 text-sm"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <Label htmlFor="full_name" className="text-sm">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Enter your full name"
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="254712345678"
                    className="mt-1 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used for order updates and M-Pesa payments
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white text-sm"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card className="luxury-card">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl text-pink-800">App Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Theme Setting */}
              <div>
                <Label className="text-sm">Theme</Label>
                <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center">
                        <Monitor className="h-4 w-4 mr-2" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Install App */}
              {isInstallable && (
                <div>
                  <Label className="text-sm">Install ELSO App</Label>
                  <Button 
                    onClick={installApp}
                    variant="outline"
                    className="w-full mt-1 border-pink-200 text-pink-600 hover:bg-pink-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Install App on Device
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    Get faster access and offline capabilities
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* About ELSO */}
          <Card className="luxury-card">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl text-pink-800">About ELSO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose text-gray-600 text-sm sm:text-base space-y-3 sm:space-y-4">
                <p>
                  ELSO is a business founded and owned by Camillah Elsie Odika. We specialize in ladies handbags, 
                  outfits and jewelry such as earrings, bracelets and necklaces. We also offer boots, available on pre-order.
                </p>
                <p>
                  At ELSO, we focus on curating unique, stylish pieces that enhance the beauty and confidence of women across Kenya. 
                  Our products are delivered countrywide ensuring that all our clients can enjoy ELSO's offerings no matter their location.
                </p>
                <p>
                  We are committed to providing premium-quality products and excellent customer service.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
