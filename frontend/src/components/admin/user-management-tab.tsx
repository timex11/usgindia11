'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { UserX, ShieldCheck, Smartphone } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  updatedAt: string;
  isBanned: boolean;
}

interface UserManagementTabProps {
  readonly users: User[];
  readonly isLoading: boolean;
}

const RoleCell = ({ user, onChange }: { user: User; onChange: (userId: string, role: string) => void }) => (
  <select
    value={user.role}
    onChange={(e) => onChange(user.id, e.target.value)}
    className={`px-2 py-1 text-xs font-medium rounded-full border-none focus:ring-2 focus:ring-indigo-500 ${
      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
    }`}
  >
    <option value="student">Student</option>
    <option value="teacher">Teacher</option>
    <option value="college">College</option>
    <option value="alumni">Alumni</option>
    <option value="admin">Admin</option>
  </select>
);

const StatusCell = ({ user }: { user: User }) => (
  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
    user.isBanned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
  }`}>
    {user.isBanned ? 'Banned' : 'Active'}
  </span>
);

const ActionCell = ({ user, onToggle }: { user: User; onToggle: (user: User) => void }) => (
  <div className="flex items-center gap-2">
    <button
      onClick={() => onToggle(user)}
      className={`p-1 rounded transition-colors ${
        user.isBanned
          ? 'hover:bg-green-50 text-green-500'
          : 'hover:bg-red-50 text-red-500'
      }`}
      title={user.isBanned ? "Unban" : "Ban"}
    >
      {user.isBanned ? <ShieldCheck size={16} /> : <UserX size={16} />}
    </button>
    <Dialog>
        <DialogTrigger asChild>
            <button className="p-1 rounded hover:bg-blue-50 text-blue-500" title="View Sessions">
                <Smartphone size={16} />
            </button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Active Sessions</DialogTitle>
                <DialogDescription>Manage active sessions for {user.fullName}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                        <p className="font-medium text-sm">Chrome on Windows</p>
                        <p className="text-xs text-slate-500">Last active: Just now</p>
                    </div>
                    <Button variant="destructive" size="sm">Revoke</Button>
                </div>
                 <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                        <p className="font-medium text-sm">Safari on iPhone</p>
                        <p className="text-xs text-slate-500">Last active: 2 hours ago</p>
                    </div>
                    <Button variant="destructive" size="sm">Revoke</Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  </div>
);

export const UserManagementTab = ({ users: initialUsers, isLoading }: UserManagementTabProps) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const { post, patch } = useApi();

  React.useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const toggleSelectUser = (userId: string) => {
      const newSelected = new Set(selectedUsers);
      if (newSelected.has(userId)) {
          newSelected.delete(userId);
      } else {
          newSelected.add(userId);
      }
      setSelectedUsers(newSelected);
  };

  const handleBulkAction = async (action: 'ban' | 'unban') => {
      if (selectedUsers.size === 0) return;
      try {
          await post('/admin/users/bulk', { 
              action, 
              userIds: Array.from(selectedUsers) 
          });
          toast.success(`Bulk ${action} completed`);
          const isBan = action === 'ban';
          setUsers(users.map(u => selectedUsers.has(u.id) ? { ...u, isBanned: isBan } : u));
          setSelectedUsers(new Set());
      } catch {
          toast.error('Bulk action failed');
      }
  };

  const handleBanToggle = async (user: User) => {
    try {
      if (user.isBanned) {
        await post(`/admin/users/${user.id}/unban`, {});
        toast.success('User unbanned successfully');
        setUsers(users.map(u => u.id === user.id ? { ...u, isBanned: false } : u));
      } else {
        await post(`/admin/users/${user.id}/ban`, {});
        toast.warning('User banned successfully');
        setUsers(users.map(u => u.id === user.id ? { ...u, isBanned: true } : u));
      }
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await patch(`/admin/users/${userId}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch {
      toast.error('Failed to update role');
    }
  };

  const columns = [
    {
        header: 'Select',
        accessorKey: 'id',
        cell: (user: User) => (
            <input 
                type="checkbox" 
                checked={selectedUsers.has(user.id)} 
                onChange={() => toggleSelectUser(user.id)} 
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
        )
    },
    { header: 'Full Name', accessorKey: 'fullName' },
    { header: 'Email', accessorKey: 'email' },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: (user: User) => <RoleCell user={user} onChange={handleRoleChange} />
    },
    {
      header: 'Status',
      accessorKey: 'isBanned',
      cell: (user: User) => <StatusCell user={user} />
    },
    {
      header: 'Last Active',
      accessorKey: 'updatedAt',
      cell: (user: User) => new Date(user.updatedAt).toLocaleDateString()
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (user: User) => <ActionCell user={user} onToggle={handleBanToggle} />
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">User Management</h3>
        <div className="flex gap-2">
            {selectedUsers.size > 0 && (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Bulk Actions ({selectedUsers.size})
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBulkAction('ban')}>
                            Ban Selected
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction('unban')}>
                            Unban Selected
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            Export Users
            </button>
        </div>
      </div>
      <DataTable 
        columns={columns} 
        data={users} 
        isLoading={isLoading} 
      />
    </div>
  );
};
