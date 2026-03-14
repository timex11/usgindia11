"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, 
  Bot, 
  Terminal, 
  Activity, 
  Settings as SettingsIcon,
  Zap,
  BarChart3,
  RefreshCw,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AiStats {
  totalConversations: number;
  totalMessages: number;
  tokenUsage: number;
  activeProviders: string[];
  costThisMonth: number;
}

interface CommandResponse {
  message: string;
  data?: unknown;
}

export default function AiConsolePage() {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<{ type: 'input' | 'output', content: string, timestamp: Date }[]>([]);
  const [stats, setStats] = useState<AiStats | null>(null);
  const [settings, setSettings] = useState<Record<string, unknown> | null>(null);
  const { token } = useAuthStore();

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ai-usage`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json() as AiStats;
        setStats(data);
      }
    } catch {
      // Error is logged or handled elsewhere
    }
  }, [token]);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ai/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const raw = await res.json();
        const parsed: Record<string, unknown> = {};
        Object.entries(raw).forEach(([k, v]) => {
          try {
            parsed[k] = JSON.parse(v as string);
          } catch {
            parsed[k] = v;
          }
        });
        setSettings(parsed);
      }
    } catch {
      console.error('Failed to fetch AI settings');
    }
  }, [token]);

  const updateSetting = async (key: string, value: unknown) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ai/settings/${key}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ value: JSON.stringify(value) })
      });
      
      if (res.ok) {
        toast.success(`Updated ${key}`);
        void fetchSettings();
      } else {
        toast.error(`Failed to update ${key}`);
      }
    } catch {
      toast.error(`Failed to update ${key}`);
    }
  };

  useEffect(() => {
    void fetchStats();
    void fetchSettings();
  }, [fetchStats, fetchSettings]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const userCommand = command.trim();
    setCommand("");
    setLogs(prev => [...prev, { type: 'input', content: userCommand, timestamp: new Date() }]);
    setIsProcessing(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/command`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ command: userCommand })
      });

      const data = await res.json() as CommandResponse;
      
      setLogs(prev => [...prev, { 
        type: 'output', 
        content: data.message || "Command executed successfully.", 
        timestamp: new Date() 
      }]);
      
      if (userCommand.toLowerCase().includes('create') || userCommand.toLowerCase().includes('update')) {
        void fetchStats();
      }
    } catch {
      toast.error("Failed to execute command");
      setLogs(prev => [...prev, { type: 'output', content: "Error executing command.", timestamp: new Date() }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Command Center</h1>
          <p className="text-muted-foreground mt-1">Manage platform operations using natural language</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            <Bot className="w-3.5 h-3.5 mr-1" /> Engine v2.0
          </Badge>
          <Button variant="outline" size="sm" onClick={() => void fetchStats()}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-600 text-white border-none shadow-lg shadow-blue-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-100">Total Tokens</CardDescription>
            <CardTitle className="text-3xl font-bold">{stats?.tokenUsage.toLocaleString() || "0"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-blue-100">
              <Zap className="w-3 h-3 mr-1" /> Real-time tracking active
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversations</CardDescription>
            <CardTitle className="text-2xl font-bold">{stats?.totalConversations || "0"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-slate-500">
              <Activity className="w-3 h-3 mr-1" /> Last 30 days
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>AI Cost</CardDescription>
            <CardTitle className="text-2xl font-bold">${stats?.costThisMonth.toFixed(2) || "0.00"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-slate-500">
              <BarChart3 className="w-3 h-3 mr-1" /> Estimated usage
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Models</CardDescription>
            <CardTitle className="text-lg font-bold">{stats?.activeProviders.join(", ") || "None"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2" /> System Healthy
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="console" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="console" className="gap-2">
            <Terminal className="w-4 h-4" /> Interactive Console
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <SettingsIcon className="w-4 h-4" /> Engine Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="console">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="h-[500px] flex flex-col bg-slate-950 border-slate-800 shadow-2xl">
                <CardHeader className="border-b border-slate-800 bg-slate-900/50 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 ml-2">usg-admin-shell --v2.0</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-4 custom-scrollbar">
                  {logs.length === 0 && (
                    <div className="text-slate-600 italic">
                      # Welcome to AI Command Console. Type a command to begin...
                      <br />
                      # Example: {`"Show system stats" or "List inactive users"`}
                    </div>
                  )}
                  {logs.map((log, i) => (
                    <div key={i} className={log.type === 'input' ? 'text-blue-400' : 'text-slate-200'}>
                      <span className="text-slate-500 mr-2">[{log.timestamp.toLocaleTimeString()}]</span>
                      <span className="mr-2">{log.type === 'input' ? '$' : '>'}</span>
                      {log.content}
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="text-blue-400 flex items-center">
                      <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                      <span className="mr-2">$</span>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  )}
                </CardContent>
                <div className="p-4 bg-slate-900/50 border-t border-slate-800">
                  <form onSubmit={handleCommand} className="relative">
                    <Input
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      placeholder="Type your command..."
                      className="bg-slate-900 border-slate-700 text-slate-200 pl-4 pr-12 h-12 focus-visible:ring-blue-500"
                      disabled={isProcessing}
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      className="absolute right-1.5 top-1.5 h-9 w-9 bg-blue-600 hover:bg-blue-700"
                      disabled={!command.trim() || isProcessing}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Quick Commands</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    "Show system statistics",
                    "List inactive users (30 days)",
                    "Check database health",
                    "List active scholarships",
                    "Generate usage report"
                  ].map((cmd, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      className="w-full justify-start text-xs h-9 bg-slate-50 hover:bg-slate-100"
                      onClick={() => setCommand(cmd)}
                    >
                      {cmd}
                    </Button>
                  ))}
                </CardContent>
              </Card>
              
              <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Pro Tip
                </h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  You can use natural language to perform complex actions. Try asking: {`"How many new students joined from Delhi University this week?"`}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Availability</CardTitle>
                <CardDescription>Toggle AI providers on or off</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {settings?.ai_model_toggles && typeof settings.ai_model_toggles === 'object' ? (
                  Object.entries(settings.ai_model_toggles as Record<string, boolean>).map(([provider, enabled]) => (
                    <div key={provider} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base capitalize">{provider}</Label>
                        <p className="text-sm text-muted-foreground">
                          {enabled ? 'Enabled' : 'Disabled'} for users
                        </p>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => {
                          const current = settings.ai_model_toggles as Record<string, boolean>;
                          updateSetting('ai_model_toggles', { ...current, [provider]: checked });
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No model toggles configured.</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rate Limits</CardTitle>
                <CardDescription>Configure global AI usage limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {settings?.ai_rate_limits && typeof settings.ai_rate_limits === 'object' ? (
                  Object.entries(settings.ai_rate_limits as Record<string, number>).map(([limitType, value]) => (
                     <div key={limitType} className="space-y-2">
                      <Label className="capitalize">{limitType.replace(/_/g, ' ')}</Label>
                      <Input 
                        type="number" 
                        value={value} 
                        onChange={(e) => {
                           const current = settings.ai_rate_limits as Record<string, number>;
                           updateSetting('ai_rate_limits', { ...current, [limitType]: parseInt(e.target.value) });
                        }}
                      />
                    </div>
                  ))
                 ) : (
                    <div className="text-sm text-muted-foreground">No rate limits configured.</div>
                 )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
