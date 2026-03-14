'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon, Sun, Laptop } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your application settings and preferences.
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Language Region</CardTitle>
              <CardDescription>
                Customize your language and region preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Language</Label>
                    <p className="text-sm text-muted-foreground">Select your preferred language.</p>
                  </div>
                  <Button variant="outline">English</Button>
               </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your password and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Password</Label>
                    <p className="text-sm text-muted-foreground">Change your password.</p>
                  </div>
                  <Button variant="outline" onClick={() => toast.info("Password change flow would open here")}>Change Password</Button>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure what emails you receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="marketing" className="flex flex-col space-y-1">
                  <span>Marketing emails</span>
                  <span className="font-normal text-muted-foreground">Receive emails about new products, features, and more.</span>
                </Label>
                <Switch id="marketing" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                 <Label htmlFor="security" className="flex flex-col space-y-1">
                  <span>Security emails</span>
                  <span className="font-normal text-muted-foreground">Receive emails about your account security.</span>
                </Label>
                <Switch id="security" defaultChecked disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
           <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Select the theme for the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
               <div className="flex flex-col gap-2 cursor-pointer group" onClick={() => toast.success("Theme set to Light")}>
                  <div className="h-24 rounded-lg border-2 border-muted bg-white p-2 hover:border-blue-600 transition-all flex items-center justify-center">
                    <Sun className="h-8 w-8 text-orange-500" />
                  </div>
                  <span className="text-center font-medium group-hover:text-blue-600">Light</span>
               </div>
               <div className="flex flex-col gap-2 cursor-pointer group" onClick={() => toast.success("Theme set to Dark")}>
                  <div className="h-24 rounded-lg border-2 border-muted bg-slate-950 p-2 hover:border-blue-600 transition-all flex items-center justify-center">
                    <Moon className="h-8 w-8 text-blue-400" />
                  </div>
                  <span className="text-center font-medium group-hover:text-blue-600">Dark</span>
               </div>
               <div className="flex flex-col gap-2 cursor-pointer group" onClick={() => toast.success("Theme set to System")}>
                  <div className="h-24 rounded-lg border-2 border-muted bg-slate-100 p-2 hover:border-blue-600 transition-all flex items-center justify-center">
                    <Laptop className="h-8 w-8 text-slate-600" />
                  </div>
                  <span className="text-center font-medium group-hover:text-blue-600">System</span>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
