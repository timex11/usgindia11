'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { User } from '@/types';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { patch } = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    state: '',
    district: '',
    city: '',
    pincode: '',
    aadhaarNumber: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || (user.user_metadata?.full_name as string) || '',
        phoneNumber: user.phoneNumber || (user.user_metadata?.phoneNumber as string) || '',
        state: user.state || (user.user_metadata?.state as string) || '',
        district: user.district || (user.user_metadata?.district as string) || '',
        city: user.city || (user.user_metadata?.city as string) || '',
        pincode: user.pincode || (user.user_metadata?.pincode as string) || '',
        aadhaarNumber: user.aadhaarNumber || (user.user_metadata?.aadhaarNumber as string) || '',
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedProfile = await patch('/auth/profile', formData);
      if (user) {
        setUser({ ...user, ...(updatedProfile as Partial<User>) });
      }
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white">Identity</h2>
          <p className="text-slate-500 font-medium">
            Manage your secure profile and platform credentials.
          </p>
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-slate-900/40 backdrop-blur-3xl border-slate-800/60 shadow-2xl rounded-3xl overflow-hidden">
          <div className="h-1.5 w-full bg-linear-to-r from-blue-600 to-indigo-600" />
          <CardHeader>
            <CardTitle className="text-2xl font-black text-white">Core Identity</CardTitle>
            <CardDescription className="text-slate-400 font-medium">Authentication and biometric associations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatarUrl || (user?.user_metadata?.avatar_url as string)} />
                <AvatarFallback className="text-lg">{user?.fullName?.charAt(0) || (user?.user_metadata?.full_name as string)?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <Button variant="outline">Change Avatar</Button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  value={formData.fullName} 
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} 
                  placeholder="John Doe" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email} disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input 
                  id="phoneNumber" 
                  value={formData.phoneNumber} 
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} 
                  placeholder="+91 98765 43210" 
                />
              </div>

               <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    value={formData.state} 
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input 
                    id="district" 
                    value={formData.district} 
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    value={formData.city} 
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input 
                    id="pincode" 
                    value={formData.pincode} 
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input 
                  id="aadhaar" 
                  value={formData.aadhaarNumber} 
                  onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })} 
                  placeholder="12-digit Aadhaar Number" 
                  maxLength={12}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Details</CardTitle>
            <CardDescription>Your educational background.</CardDescription>
          </CardHeader>
           <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="university">University / Institution</Label>
                <Input id="university" defaultValue={user?.universityId || "Not set"} disabled={true} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="college">College</Label>
                 <Input id="college" defaultValue={user?.collegeId || "Not set"} disabled={true} />
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
