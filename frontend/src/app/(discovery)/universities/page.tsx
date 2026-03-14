'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Building2, MapPin, Search, ArrowRight, GraduationCap, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface Institution {
  id: string;
  name: string;
  location: string;
  type?: 'University' | 'College';
  ranking?: string | number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function InstitutionsPage() {
  const { get, loading } = useApi();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<'All' | 'University' | 'College'>('All');

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const data = await get<Institution[]>('/institutions');
        setInstitutions(Array.isArray(data) ? data : []);
      } catch {}
    };
    fetchInstitutions();
  }, [get]);

  const filtered = institutions.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) || 
                          (i.location && i.location.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = activeFilter === 'All' || i.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0a0f1a] bg-radial-[circle_at_top_right]_from-[#162032] to-[#0a0f1a] text-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-indigo-500/10 bg-indigo-950/20 pt-20 pb-16 px-6">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-size-[32px_32px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 bg-indigo-500 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto space-y-6 text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400"
          >
            Discover Top Institutions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Explore India's premier universities and colleges. Find the perfect campus, programs, and opportunities for your future.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto pt-6 relative group"
          >
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl">
              <Search className="w-5 h-5 text-indigo-400 ml-3 shrink-0" />
              <Input
                placeholder="Search by name, city, or state..."
                className="border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-100 placeholder:text-slate-500 h-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-3 pt-6"
          >
            {['All', 'University', 'College'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as 'All' | 'University' | 'College')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter 
                    ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50'
                }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-[280px] w-full rounded-2xl bg-slate-800/50 block" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filtered.map(inst => (
                <motion.div key={inst.id} variants={itemVariants}>
                  <Link href={`/universities/${inst.id}`} className="block h-full outline-none">
                    <div className="group relative h-full flex flex-col bg-slate-900/40 backdrop-blur-md border border-slate-700/50 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.3)] overflow-hidden">
                      {/* Interactive Background Gradient */}
                      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10 flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                          <Building2 className="w-7 h-7" />
                        </div>
                        <Badge variant="outline" className={`bg-slate-900/50 backdrop-blur-sm border-slate-700 ${inst.type === 'University' ? 'text-blue-400' : 'text-emerald-400'}`}>
                          {inst.type || 'University'}
                        </Badge>
                      </div>
                      
                      <div className="relative z-10 flex-1">
                        <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                          {inst.name}
                        </h3>
                        <div className="flex items-center text-sm text-slate-400 mb-4">
                          <MapPin className="w-4 h-4 mr-1 shrink-0 text-slate-500" />
                          <span className="truncate">{inst.location || 'India'}</span>
                        </div>
                      </div>

                      <div className="relative z-10 mt-auto pt-6 border-t border-slate-700/50 flex items-center justify-between">
                        <div className="flex gap-4">
                           <div className="flex items-center text-xs text-slate-400">
                             <GraduationCap className="w-4 h-4 mr-1 text-slate-500" />
                             <span>120+ Courses</span>
                           </div>
                           <div className="flex items-center text-xs text-slate-400">
                             <Users className="w-4 h-4 mr-1 text-slate-500" />
                             <span>10k+ Alumni</span>
                           </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500 transition-colors duration-300">
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-slate-900/30 backdrop-blur-md border border-slate-800 rounded-3xl"
          >
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-2">No institutions found</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              We couldn't find any institutions matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <button 
              onClick={() => { setSearch(""); setActiveFilter("All"); }}
              className="mt-8 px-6 py-2 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-full transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
