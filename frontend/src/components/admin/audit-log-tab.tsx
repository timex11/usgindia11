'use client';

import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Download, Search, Eye } from 'lucide-react';

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  details: Record<string, unknown>;
  severity: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

interface AuditLogTabProps {
  logs: AuditLog[];
  isLoading: boolean;
}

export function AuditLogTab({ logs, isLoading }: AuditLogTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,User ID,Action,Severity,IP Address,Date,Details\n"
      + filteredLogs.map(log => {
          return `${log.id},${log.user_id || ''},${log.action},${log.severity},${log.ip_address || ''},${log.created_at},"${JSON.stringify(log.details).replace(/"/g, '""')}"`;
      }).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "audit_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Audit Logs</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow>
                 <TableCell colSpan={6} className="text-center h-24">Loading logs...</TableCell>
               </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">No logs found.</TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {log.created_at ? format(new Date(log.created_at), 'PPP p') : 'N/A'}
                  </TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell className="font-mono text-xs">{log.user_id ? log.user_id.substring(0, 8) + '...' : 'System'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.severity === 'high' ? 'bg-red-100 text-red-700' :
                      log.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {log.severity}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{log.ip_address || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Audit Log Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-semibold">ID:</span> {selectedLog?.id}
                            </div>
                            <div>
                              <span className="font-semibold">Action:</span> {selectedLog?.action}
                            </div>
                            <div>
                              <span className="font-semibold">User:</span> {selectedLog?.user_id}
                            </div>
                            <div>
                              <span className="font-semibold">Date:</span> {selectedLog?.created_at && format(new Date(selectedLog.created_at), 'PPP p')}
                            </div>
                            <div>
                              <span className="font-semibold">IP:</span> {selectedLog?.ip_address}
                            </div>
                            <div>
                              <span className="font-semibold">User Agent:</span> {selectedLog?.user_agent}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Details (JSON)</h4>
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                              {JSON.stringify(selectedLog?.details, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
