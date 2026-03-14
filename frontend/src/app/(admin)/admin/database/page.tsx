'use client';

import React, { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Database, Table as TableIcon, HardDrive } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableStat {
  table_name: string;
  row_count: number;
  total_size: string;
}

interface DbStats {
  tables: TableStat[];
  totalSize: string;
}

export default function DatabasePage() {
  const { get } = useApi();
  const [stats, setStats] = useState<DbStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await get('/stats/db');
        setStats(data as DbStats);
      } catch (error) {
        console.error('Failed to fetch db stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [get]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="w-12 h-12 text-blue-500" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">Database Status</h1>
        <div className="flex items-center gap-2 text-sm text-green-400">
            <Database className="w-4 h-4 animate-pulse" />
            PostgreSQL Connected
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-slate-900 border-slate-800 text-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSize}</div>
            <p className="text-xs text-muted-foreground">
              Total database size on disk
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
            <TableIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tables.length}</div>
            <p className="text-xs text-muted-foreground">
              Number of user tables
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Table</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate text-sm" title={stats.tables[0]?.table_name}>
                {stats.tables[0]?.table_name || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
               {Number(stats.tables[0]?.row_count).toLocaleString()} rows
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-200">
        <CardHeader>
          <CardTitle>Table Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-800/50">
                <TableHead className="text-slate-400">Table Name</TableHead>
                <TableHead className="text-slate-400">Rows</TableHead>
                <TableHead className="text-slate-400">Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.tables.map((table) => (
                <TableRow key={table.table_name} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="font-medium text-slate-200">{table.table_name}</TableCell>
                  <TableCell className="text-slate-300">{Number(table.row_count).toLocaleString()}</TableCell>
                  <TableCell className="text-slate-300">{table.total_size}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
