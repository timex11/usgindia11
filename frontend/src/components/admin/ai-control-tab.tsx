"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bot, Shield, AlertCircle, RefreshCw, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface AiSettings {
  ai_model_toggles: Record<string, boolean>;
  ai_rate_limits: Record<string, number>;
}

export function AiControlTab() {
  const [settings, setSettings] = useState<AiSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ai/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json() as AiSettings;
        setSettings(data);
      }
    } catch {
      toast.error("Failed to load AI settings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const handleToggle = async (key: string, value: boolean) => {
    if (!settings) return;
    
    const newToggles = { ...settings.ai_model_toggles, [key]: value };
    setSettings({ ...settings, ai_model_toggles: newToggles });
    
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ai/settings/ai_model_toggles`, {
            method: 'PATCH',
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newToggles)
        });
        toast.success(`${key} updated`);
    } catch {
        toast.error("Failed to update setting");
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" /> Model Selection
            </CardTitle>
            <CardDescription>Enable or disable specific AI models for the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings?.ai_model_toggles || {}).map(([model, enabled]) => (
              <div key={model} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold uppercase">{model}</Label>
                  <p className="text-xs text-muted-foreground">Active for all users</p>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={(val: boolean) => handleToggle(model, val)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" /> Safety & Limits
            </CardTitle>
            <CardDescription>Configure rate limits and content filters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Daily Request Limit</span>
                    <Badge variant="outline" className="bg-white">100/user</Badge>
                </div>
                <p className="text-xs text-slate-500">Maximum AI messages a student can send per 24 hours.</p>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 border border-orange-100 text-orange-800">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-xs leading-relaxed">{"Changes to safety boundaries may require an engine restart to take full effect across all clusters."}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={fetchSettings}>
          <RefreshCw className="w-4 h-4 mr-2" /> Reset Changes
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => toast.success("All settings saved")}>
          <Save className="w-4 h-4 mr-2" /> Save All Settings
        </Button>
      </div>
    </div>
  );
}
