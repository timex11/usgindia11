"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, Calendar, Loader2, IndianRupee, MoveRight } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { JobApplyButton } from "@/components/jobs/job-apply-button";
import { motion, AnimatePresence } from "framer-motion";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salaryRange: string;
  createdAt: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { token } = useAuthStore();

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json() as { data: Job[] };
        setJobs(data.data);
      }
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, search]);

  return (
    <div className="min-h-screen bg-[#0a0f1a] bg-radial-[circle_at_top_right]_from-[#162032] to-[#0a0f1a] text-slate-100 flex-1 h-full overflow-y-auto w-full">
      <div className="max-w-7xl mx-auto py-12 px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-10">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 mb-2"
            >
              Careers Hub
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-lg"
            >
              Discover high-impact roles and internships tailored for you.
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-full md:w-96 group"
          >
            <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-1 shadow-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <Input 
                placeholder="Search roles or companies..." 
                className="pl-12 border-0 bg-transparent text-slate-100 placeholder:text-slate-500 h-12 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </motion.div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin" />
            </div>
            <p className="text-slate-400 font-medium tracking-widest uppercase text-sm animate-pulse">Scanning opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-slate-900/30 backdrop-blur-md rounded-3xl border border-slate-800/50 mx-auto max-w-2xl"
          >
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inset">
               <Briefcase className="h-10 w-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-3">No matching roles found</h3>
            <p className="text-slate-400 max-w-sm mx-auto">
              We couldn't find any opportunities matching your current search filters.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <AnimatePresence>
              {jobs.map((job) => (
                <motion.div key={job.id} variants={item} layoutId={`job-${job.id}`}>
                  <Card className="h-full group bg-slate-900/40 backdrop-blur-xl border-slate-800/60 hover:border-indigo-500/50 shadow-lg hover:shadow-[0_15px_40px_-15px_rgba(99,102,241,0.3)] transition-all duration-500 overflow-hidden relative flex flex-col">
                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    <CardHeader className="pb-4 relative z-10">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 text-slate-300 font-bold text-xl group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-colors shadow-inner">
                            {job.company.charAt(0)}
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
                              {job.title}
                            </CardTitle>
                            <CardDescription className="text-sm font-medium text-slate-400 mt-1">
                              {job.company}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-slate-900/50 border-slate-700 text-blue-400 shrink-0 capitalize">
                          {job.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex flex-col flex-1 relative z-10">
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 mb-6">
                        <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md border border-slate-700/50">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="truncate max-w-[120px]">{job.location}</span>
                        </div>
                        {job.salaryRange && (
                          <div className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-300 px-2 py-1 rounded-md border border-indigo-500/20 font-medium">
                            <IndianRupee className="h-3.5 w-3.5" />
                            {job.salaryRange}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md border border-slate-700/50">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-400 line-clamp-2 mb-6 leading-relaxed flex-1">
                        {job.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 mt-auto">
                        <JobApplyButton jobId={job.id} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
