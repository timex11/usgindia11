'use client';

import React, { useState, useEffect } from 'react';
import { AuditLogTab, AuditLog } from '@/components/admin/audit-log-tab';
import { useApi } from '@/hooks/useApi';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function AuditPage() {
  const { get } = useApi();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        // Assuming backend endpoint is /audit
        const res = await get('/audit') as AuditLog[];
        setLogs(res);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
        setError('Failed to load audit logs. Ensure you have admin permissions.');
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [get]);

  return (
    <div className="p-6">
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
      <AuditLogTab logs={logs} isLoading={loading} />
    </div>
  );
}
