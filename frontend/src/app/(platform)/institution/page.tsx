'use client';

import { Users, BookOpen, TrendingUp, Building, ArrowUpRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
} as const;

export default function InstitutionDashboardPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] bg-radial-[circle_at_top_right]_from-[#162032] to-[#0a0f1a] text-slate-100 p-8 pt-6 flex-1 h-full overflow-y-auto">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <motion.h2 variants={itemVariants} className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400">
              Institution Control Center
            </motion.h2>
            <motion.p variants={itemVariants} className="text-slate-400 mt-1">
              Real-time analytics and management for your university programs.
            </motion.p>
          </div>
          <motion.div variants={itemVariants} className="flex gap-3">
             <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-700 shadow-xs">
                Export Data
             </button>
             <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                Add Program
             </button>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Stat Cards */}
          {[
            { title: "Total Enrolled", icon: Users, value: "1,240", trend: "+14%", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { title: "Active Programs", icon: BookOpen, value: "48", trend: "+2 this month", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
            { title: "New Applications", icon: TrendingUp, value: "3,542", trend: "High demand", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
            { title: "Profile Impressions", icon: Building, value: "12.5k", trend: "+8.2% vs last week", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" }
          ].map((stat, i) => (
            <motion.div 
              key={stat.title} 
              whileHover={{ y: -5, scale: 1.02 }}
              className={`bg-slate-900/40 backdrop-blur-xl border ${stat.border} rounded-2xl p-6 relative overflow-hidden group`}
            >
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl group-hover:blur-3xl transition-all duration-500`} />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} border ${stat.border}`}>
                   <stat.icon className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="bg-slate-900/50 border-slate-700 text-slate-300">
                  <ArrowUpRight className="w-3 h-3 mr-1 text-emerald-400" />
                  Live
                </Badge>
              </div>
              <div className="relative z-10">
                <h3 className="text-slate-400 text-sm font-medium">{stat.title}</h3>
                <div className="text-3xl font-bold text-slate-100 mt-1 mb-2">{stat.value}</div>
                <p className="text-xs text-slate-500 flex items-center">
                  <Activity className="w-3 h-3 mr-1" />
                  {stat.trend}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={containerVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-8">
           <motion.div variants={itemVariants} className="col-span-4 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
               <div className="flex items-center justify-between mb-6">
                 <div>
                   <h3 className="text-lg font-bold text-slate-100">Application Velocity</h3>
                   <p className="text-sm text-slate-400">Volume over the last 30 days</p>
                 </div>
                 <select className="bg-slate-800 border-slate-700 text-slate-200 rounded-lg text-sm px-3 py-1.5 outline-none">
                    <option>Last 30 Days</option>
                    <option>This Quarter</option>
                 </select>
               </div>
               
               <div className="h-75 w-full relative flex items-end justify-between px-2 gap-2 mt-auto">
                 {/* Fake Chart Bars with animations */}
                 {[40, 70, 45, 90, 65, 85, 100, 50, 80, 60, 40, 75].map((height, i) => (
                   <div key={`bar-${i}`} className="w-full flex flex-col items-center gap-2 group">
                     <motion.div 
                       initial={{ height: 0 }}
                       animate={{ height: `${height}%` }}
                       transition={{ duration: 1, delay: i * 0.05, type: 'spring' }}
                       className="w-full bg-linear-to-t from-indigo-600/50 to-indigo-400/80 rounded-t-sm group-hover:from-indigo-500 group-hover:to-indigo-300 transition-colors relative"
                     >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                         {height * 12} apps
                       </div>
                     </motion.div>
                     <span className="text-[10px] text-slate-500">W{i+1}</span>
                   </div>
                 ))}
               </div>
           </motion.div>

           <motion.div variants={itemVariants} className="col-span-3 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
               <h3 className="text-lg font-bold text-slate-100 mb-1">Incoming Inquiries</h3>
               <p className="text-sm text-slate-400 mb-6">Prospective student requests requiring action.</p>
               
               <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    {name: "Rahul Sharma", req: "B.Tech CS Syllabus query", time: "10 mins ago", unread: true},
                    {name: "Priya Patel", req: "Hostel availability for PG", time: "2 hours ago", unread: true},
                    {name: "Amit Kumar", req: "Fee structure clarification", time: "5 hours ago", unread: false},
                    {name: "Sneha Reddy", req: "Placement statistics", time: "Yesterday", unread: false},
                  ].map((inq, i) => (
                    <div key={inq.name} className="flex gap-4 p-4 rounded-xl hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50 transition-all cursor-pointer group">
                       <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 text-slate-300 font-medium group-hover:border-indigo-500 transition-colors">
                         {inq.name.charAt(0)}
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start mb-1">
                           <h4 className={`text-sm font-medium truncate ${inq.unread ? 'text-slate-100' : 'text-slate-400'}`}>
                             {inq.name}
                           </h4>
                           <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">{inq.time}</span>
                         </div>
                         <p className="text-xs text-slate-400 truncate">{inq.req}</p>
                       </div>
                       {inq.unread && (
                         <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 self-center shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                       )}
                    </div>
                  ))}
               </div>
               <button className="w-full mt-4 py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-xl text-sm font-medium transition-colors border border-slate-700/50">
                 View All Inquiries
               </button>
           </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
