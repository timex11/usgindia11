'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OverviewTab, OverviewStats, ActivityItem } from '@/components/admin/overview-tab';
import { useApi } from '@/hooks/useApi';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle } from 'lucide-react';

export default function OverviewPage() {
  const { get } = useApi();
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const statsRes = await get('/admin/stats') as OverviewStats;
        const activityRes = await get('/admin/activity') as ActivityItem[];
        
        setStats(statsRes);
        setActivity(activityRes);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch admin overview data:', err);
        setError('Failed to load administrative data. Please check your permissions.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [get]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Spinner className="w-12 h-12 text-blue-600" />
        <p className="text-slate-500 animate-pulse font-mono tracking-widest uppercase text-xs">Synchronizing Enterprise Core...</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400"
        >
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </motion.div>
      )}
      <OverviewTab stats={stats} activity={activity} />
    </div>
  );
}
