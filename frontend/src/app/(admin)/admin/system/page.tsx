'use client';

import React, { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Activity, Cpu, HardDrive, Server, Zap, Database, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface SystemStats {
  cpu: {
    manufacturer: string;
    brand: string;
    speed: number;
    cores: number;
    physicalCores: number;
  };
  memory: {
    total: number;
    free: number;
    used: number;
    active: number;
    available: number;
  };
  os: {
    platform: string;
    distro: string;
    release: string;
    codename: string;
    kernel: string;
    arch: string;
    hostname: string;
  };
  load: {
    avgLoad: number;
    currentLoad: number;
  };
  disk: Array<{
    device: string;
    type: string;
    name: string;
    vendor: string;
    size: number;
  }>;
  infrastructure?: {
      database: {
          connections: number;
          type: string;
      };
      queues: {
          [key: string]: {
              waiting: number;
              active: number;
              failed: number;
              error?: string;
          }
      }
  }
}

export default function SystemPage() {
  const { get } = useApi();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await get('/system/stats');
        setStats(data as SystemStats);
      } catch (error) {
        console.error('Failed to fetch system stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, [get]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="w-12 h-12 text-blue-500" />
      </div>
    );
  }

  if (!stats) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">System Status</h1>
        <div className="flex items-center gap-2 text-sm text-green-400">
            <Activity className="w-4 h-4 animate-pulse" />
            Live Monitoring
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800 text-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Load</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.load.currentLoad.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.cpu.cores} Cores ({stats.cpu.physicalCores} Physical)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats.memory.used / stats.memory.total) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {formatBytes(stats.memory.used)} / {formatBytes(stats.memory.total)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Info</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate text-sm" title={stats.os.distro}>
                {stats.os.distro}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.os.arch} - {stats.os.platform}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.disk.length} Drives</div>
            <p className="text-xs text-muted-foreground">
              Primary: {formatBytes(stats.disk[0]?.size || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {stats.infrastructure && (
        <div className="grid gap-4 md:grid-cols-2">
           <Card className="bg-slate-900 border-slate-800 text-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database Health</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.infrastructure.database.connections}</div>
              <p className="text-xs text-muted-foreground">Active Connections ({stats.infrastructure.database.type})</p>
            </CardContent>
          </Card>

           <Card className="bg-slate-900 border-slate-800 text-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Message Queues</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.infrastructure.queues).map(([name, qStats]) => (
                    <div key={name} className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                        <span className="capitalize font-medium">{name}</span>
                        <span className="flex gap-3 text-xs">
                             <span className="text-yellow-500 font-mono">{qStats.waiting} wait</span>
                             <span className="text-green-500 font-mono">{qStats.active} act</span>
                             <span className="text-red-500 font-mono">{qStats.failed} fail</span>
                        </span>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
          >
              <h3 className="text-lg font-semibold mb-4 text-white">CPU Details</h3>
              <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex justify-between">
                      <span>Brand</span>
                      <span className="text-white">{stats.cpu.brand}</span>
                  </div>
                  <div className="flex justify-between">
                      <span>Manufacturer</span>
                      <span className="text-white">{stats.cpu.manufacturer}</span>
                  </div>
                  <div className="flex justify-between">
                      <span>Base Speed</span>
                      <span className="text-white">{stats.cpu.speed} GHz</span>
                  </div>
              </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
          >
              <h3 className="text-lg font-semibold mb-4 text-white">OS Details</h3>
              <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex justify-between">
                      <span>Hostname</span>
                      <span className="text-white">{stats.os.hostname}</span>
                  </div>
                  <div className="flex justify-between">
                      <span>Kernel</span>
                      <span className="text-white">{stats.os.kernel}</span>
                  </div>
                  <div className="flex justify-between">
                      <span>Release</span>
                      <span className="text-white">{stats.os.release}</span>
                  </div>
              </div>
          </motion.div>
      </div>
    </div>
  );
}
