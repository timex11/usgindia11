'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserManagementTab, User } from '@/components/admin/user-management-tab';
import { useApi } from '@/hooks/useApi';
import { AlertCircle } from 'lucide-react';

export default function UsersPage() {
  const { get } = useApi();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const usersRes = await get('/admin/users') as User[];
        setUsers(usersRes);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load user data. Please check your permissions.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [get]);

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
      <UserManagementTab users={users} isLoading={loading} />
    </div>
  );
}
