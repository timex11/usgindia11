'use client';

import React, { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { get, post } = useApi();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await get('/system/settings') as Record<string, string>;
        setSettings(res || {});
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [get]);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await post('/system/settings', settings);
      alert('Settings saved successfully');
    } catch (err) {
      console.error('Failed to save settings', err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Organization Settings</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage global system behavior.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Disable access for non-admin users.</p>
                </div>
                <Switch 
                  checked={settings['maintenance_mode'] === 'true'}
                  onCheckedChange={(checked) => handleChange('maintenance_mode', String(checked))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow new users to sign up.</p>
                </div>
                <Switch 
                  checked={settings['allow_registration'] === 'true'}
                  onCheckedChange={(checked) => handleChange('allow_registration', String(checked))}
                />
              </div>
               <div className="space-y-1">
                <Label>Site Name</Label>
                <Input 
                  value={settings['site_name'] || ''} 
                  onChange={(e) => handleChange('site_name', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Customize the look and feel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Logo URL</Label>
                <Input 
                  value={settings['logo_url'] || ''} 
                  onChange={(e) => handleChange('logo_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1">
                <Label>Favicon URL</Label>
                <Input 
                  value={settings['favicon_url'] || ''} 
                  onChange={(e) => handleChange('favicon_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color"
                    className="w-12 h-10 p-1"
                    value={settings['primary_color'] || '#000000'} 
                    onChange={(e) => handleChange('primary_color', e.target.value)}
                  />
                  <Input 
                    value={settings['primary_color'] || ''} 
                    onChange={(e) => handleChange('primary_color', e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal">
            <Card>
            <CardHeader>
              <CardTitle>Legal Documents</CardTitle>
              <CardDescription>Edit Terms of Service and Privacy Policy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-1">
                <Label>Terms of Service</Label>
                <Textarea 
                  className="min-h-[200px]"
                  value={settings['terms_of_service'] || ''} 
                  onChange={(e) => handleChange('terms_of_service', e.target.value)}
                />
              </div>
               <div className="space-y-1">
                <Label>Privacy Policy</Label>
                <Textarea 
                  className="min-h-[200px]"
                  value={settings['privacy_policy'] || ''} 
                  onChange={(e) => handleChange('privacy_policy', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

         <TabsContent value="integrations">
            <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Configure external services (SMTP, etc).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-1">
                <Label>SMTP Host</Label>
                <Input 
                  value={settings['smtp_host'] || ''} 
                  onChange={(e) => handleChange('smtp_host', e.target.value)}
                />
              </div>
               <div className="space-y-1">
                <Label>SMTP Port</Label>
                <Input 
                  value={settings['smtp_port'] || ''} 
                  onChange={(e) => handleChange('smtp_port', e.target.value)}
                />
              </div>
               <div className="space-y-1">
                <Label>SMTP User</Label>
                <Input 
                  value={settings['smtp_user'] || ''} 
                  onChange={(e) => handleChange('smtp_user', e.target.value)}
                />
              </div>
               <div className="space-y-1">
                <Label>SMTP Password</Label>
                <Input 
                  type="password"
                  value={settings['smtp_password'] || ''} 
                  onChange={(e) => handleChange('smtp_password', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
