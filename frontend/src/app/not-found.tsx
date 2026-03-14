'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] bg-radial-[circle_at_center]_from-[#162032] to-[#0a0f1a] flex items-center justify-center p-6 text-slate-100 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-2xl relative z-10 text-center"
      >
        <motion.div 
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto w-32 h-32 mb-8 relative"
        >
          <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-2 bg-indigo-500/10 rounded-full flex items-center justify-center backdrop-blur-md">
             <Compass className="w-16 h-16 text-indigo-400" />
          </div>
        </motion.div>

        <h1 className="text-8xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-white to-white/40">
          404
        </h1>
        
        <h2 className="text-3xl font-bold mb-4 text-slate-200">
          Lost in hyperspace
        </h2>
        
        <p className="text-lg text-slate-400 mb-10 max-w-md mx-auto">
          We can't seem to find the page you're looking for. It might have been moved, deleted, or perhaps it never existed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button className="w-full sm:w-auto h-12 px-8 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-medium transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto h-12 px-8 bg-slate-800/50 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600 rounded-full font-medium transition-colors">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
