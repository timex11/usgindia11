'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ListOrdered } from 'lucide-react';

export default function QueuesPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  // If the Bull Board is mounted at /queues relative to the app root, but app has global prefix api/v1
  // Then it should be at /api/v1/queues.
  // However, BullBoard usually mounts on the underlying Express app.
  // If registered via NestJS module with forRoot, it respects the global prefix?
  // Let's assume it does.
  const queueUrl = `${apiUrl}/queues`;

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">Job Queues</h1>
        <div className="flex items-center gap-2 text-sm text-green-400">
            <ListOrdered className="w-4 h-4" />
            BullMQ Board
        </div>
      </div>

      <Card className="h-full bg-slate-900 border-slate-800 text-slate-200 overflow-hidden">
        <CardContent className="p-0 h-full">
            <iframe 
                src={queueUrl} 
                className="w-full h-full border-0 bg-white"
                title="Bull Board"
            />
        </CardContent>
      </Card>
    </div>
  );
}
