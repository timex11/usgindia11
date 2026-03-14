'use client';

import React from 'react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Users, FileText, Briefcase, CheckCircle, Activity, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export interface OverviewStats {
  users: number;
  scholarships: number;
  jobs: number;
  applications: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  severity: string;
  createdAt: string;
  ipAddress?: string;
}

interface OverviewTabProps {
  readonly stats: OverviewStats | null;
  readonly activity: ActivityItem[];
}

export const OverviewTab = ({ stats, activity }: OverviewTabProps) => {
  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'bg-rose-500 shadow-rose-500/40';
    if (severity === 'medium') return 'bg-amber-500 shadow-amber-500/40';
    return 'bg-emerald-500 shadow-emerald-500/40';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Users", val: stats?.users || 0, icon: Users, desc: "Profiles across India", trend: 12 },
          { title: "Active Scholarships", val: stats?.scholarships || 0, icon: FileText, desc: "Global opportunities", trend: 5 },
          { title: "Career Listings", val: stats?.jobs || 0, icon: Briefcase, desc: "Open job roles", trend: -2 },
          { title: "Submissions", val: stats?.applications || 0, icon: CheckCircle, desc: "Total applications", trend: 18 }
        ].map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <StatsCard
              title={s.title}
              value={s.val}
              icon={s.icon}
              description={s.desc}
              trend={{ value: Math.abs(s.trend), isUp: s.trend > 0 }}
              className="bg-card/40 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-300"
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card/30 backdrop-blur-xl rounded-4xl border border-border/50 shadow-2xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black flex items-center gap-3">
              <Activity className="w-6 h-6 text-primary" />
              Live System Activity
            </h3>
            <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full animate-pulse">
              REAL-TIME FEED
            </div>
          </div>
          
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {activity.map((item, idx) => (
              <div 
                key={item.id} 
                className="flex items-center gap-4 group transition-all"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`w-3 h-3 rounded-full shadow-lg ${getSeverityColor(item.severity)}`} />
                <div className="flex-1 bg-secondary/20 group-hover:bg-secondary/40 border border-border/50 p-4 rounded-2xl transition-all">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-slate-200 font-bold tracking-tight">
                      {item.action.replaceAll('_', ' ')}
                    </p>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/30 px-2 py-0.5 rounded">
                      {item.severity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground text-xs font-semibold">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                    <p className="text-primary/70 text-[10px] font-mono">
                      {item.ipAddress || 'INTERNAL'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {activity.length === 0 && (
              <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border/50">
                <p className="text-muted-foreground font-medium italic">Scanning for signals... No active logs found.</p>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* System Vitals Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/30 backdrop-blur-xl rounded-4xl border border-border/50 shadow-2xl p-8 h-fit"
        >
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <h3 className="text-xl font-black">System Vitals</h3>
          </div>
          
          <div className="space-y-6">
            {[
              { label: "PostgreSQL Database", status: "Healthy", color: "text-emerald-400", bg: "bg-emerald-400/10" },
              { label: "Redis Cluster", status: "Scaling...", color: "text-amber-400", bg: "bg-amber-400/10" },
              { label: "AI Engine (v4.5)", status: "Optimal", color: "text-emerald-400", bg: "bg-emerald-400/10" },
              { label: "BullMQ Workers", status: "Listening", color: "text-blue-400", bg: "bg-blue-400/10" },
            ].map((vital, i) => (
              <div key={i} className="flex justify-between items-center border-b border-border/30 pb-4 last:border-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-300">{vital.label}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">SECURE NODE-71</span>
                </div>
                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${vital.bg} ${vital.color}`}>
                  {vital.status}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-3xl bg-primary/5 border border-primary/20 relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
                <Zap className="w-4 h-4" /> Optimization
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cache hit rate is at <span className="text-white font-bold">94.2%</span>. Auto-scaling is active for all core microservices.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
