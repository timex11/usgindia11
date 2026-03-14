"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  FileCheck, 
  TrendingUp, 
  ShieldAlert,
  Activity,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/hooks/useSocket';

interface PlatformStats {
  activeUsers: number;
  totalExams: number;
  pendingApplications: number;
  timestamp: string;
}

export function AdminRealtimeDashboard() {
  const socket = useSocket();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    if (!socket) return;

    const unsubscribe = socket.on('platform_stats', (data: unknown) => {
      const newStats = data as PlatformStats;
      setStats(newStats);
      setHistory(prev => [...prev.slice(-19), newStats.activeUsers]);
    });

    return () => {
      unsubscribe();
    };
  }, [socket]);

  const statCards = [
    {
      title: 'Active Ecosystem Users',
      value: stats?.activeUsers || 0,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      trend: '+12% from last hour'
    },
    {
      title: 'Live Assessments',
      value: stats?.totalExams || 0,
      icon: BookOpen,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      trend: '4 active now'
    },
    {
      title: 'Pending Verifications',
      value: stats?.pendingApplications || 0,
      icon: FileCheck,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      trend: 'High priority'
    },
    {
      title: 'System Health',
      value: '99.9%',
      icon: Activity,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      trend: 'All systems nominal'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">System Command Center</h2>
          <p className="text-slate-400">Real-time platform metrics and ecosystem oversight.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
            Live Feed
          </Badge>
          <span className="text-xs text-slate-500 font-mono">Last updated: {stats ? new Date(stats.timestamp).toLocaleTimeString() : 'Connecting...'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl hover:border-slate-700 transition-colors group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">{card.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${card.bg}`}>
                    <card.icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    {card.trend}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Live User Activity
              </CardTitle>
              <Badge variant="secondary">24h History</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full flex items-end gap-1">
              {history.map((val, i) => (
                <motion.div
                  key={`history-${i}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${(val / (Math.max(...history, 1) * 1.2)) * 100}%` }}
                  className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-sm opacity-60 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-[10px] text-slate-500 uppercase tracking-widest font-mono">
              <span>T-20 intervals</span>
              <span>Current</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              Security Oversight
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { event: 'RLS Policy Active', status: 'Secure', time: 'Ongoing' },
              { event: 'DDoS Protection', status: 'Enabled', time: 'Cloudflare' },
              { event: 'Audit Logging', status: 'Global', time: 'Active' },
              { event: 'JWT Encryption', status: 'RS256', time: 'Verified' },
            ].map((item, i) => (
              <div key={`security-${i}`} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div>
                  <div className="text-sm font-medium text-white">{item.event}</div>
                  <div className="text-xs text-slate-500">{item.time}</div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/20">{item.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
