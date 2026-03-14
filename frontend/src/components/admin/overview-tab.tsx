'use client';

import React from 'react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Users, FileText, Briefcase, CheckCircle } from 'lucide-react';

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
    if (severity === 'high') return 'bg-red-500';
    if (severity === 'medium') return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats?.users || 0}
          icon={Users}
          description="Total registered profiles"
          trend={{ value: 12, isUp: true }}
        />
        <StatsCard
          title="Active Scholarships"
          value={stats?.scholarships || 0}
          icon={FileText}
          description="Currently open for apps"
          trend={{ value: 5, isUp: true }}
        />
        <StatsCard
          title="Job Listings"
          value={stats?.jobs || 0}
          icon={Briefcase}
          description="Available opportunities"
          trend={{ value: 2, isUp: false }}
        />
        <StatsCard
          title="Total Applications"
          value={stats?.applications || 0}
          icon={CheckCircle}
          description="Processed submissions"
          trend={{ value: 18, isUp: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {activity.map((item) => (
              <div key={item.id} className="flex items-center gap-4 text-sm border-b border-gray-50 pb-3">
                <div className={`w-2 h-2 rounded-full ${getSeverityColor(item.severity)}`} />
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{item.action.replaceAll('_', ' ')}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(item.createdAt).toLocaleString()} • {item.ipAddress || 'System'}
                  </p>
                </div>
              </div>
            ))}
            {activity.length === 0 && (
              <p className="text-gray-400 text-center py-4">No recent activity.</p>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">System Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Database</span>
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Healthy</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Redis Cache</span>
              <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">Down (v3.0)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">AI Gateway</span>
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
