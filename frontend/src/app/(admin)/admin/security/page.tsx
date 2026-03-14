import React from 'react';
import { Shield } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="p-12 text-center text-slate-400 bg-slate-900/50 rounded-xl border border-dashed border-slate-800 flex flex-col items-center gap-4">
      <Shield className="w-12 h-12 text-red-500 opacity-50" />
      <p className="text-lg font-medium">Security Threat Assessment</p>
      <p className="text-sm">Real-time DDoS mitigation and intrusion detection logs integration.</p>
    </div>
  );
}
