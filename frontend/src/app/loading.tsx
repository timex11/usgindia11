'use client';

import { motion } from 'framer-motion';

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#0a0f1a]/80 backdrop-blur-md">
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20">
          <motion.div
            className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 border-4 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Inner pulse */}
          <motion.div 
            className="absolute inset-4 bg-indigo-500 rounded-full blur-md opacity-50"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.p
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="mt-6 text-sm font-medium text-indigo-400 tracking-[0.2em] uppercase"
        >
          Loading Environment...
        </motion.p>
      </div>
    </div>
  );
}
