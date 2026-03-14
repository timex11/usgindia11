"use client";

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, CheckCircle, ArrowRight, Sparkles, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function ExamsLandingPage() {
  const sections = [
    {
      title: "Active Results",
      icon: CheckCircle,
      color: "text-emerald-500",
      border: "border-emerald-500/50",
      items: [
        "UPSC Civil Services Final Result 2024 Declared",
        "SSC GD Constable Shortlist 2025 Out",
        "NEET PG 2024 Round 2 Allotment",
        "IBPS PO Mains Result Available",
        "SBI Clerk Final Scorecard 2024"
      ]
    },
    {
      title: "Admit Cards",
      icon: FileText,
      color: "text-blue-500",
      border: "border-blue-500/50",
      items: [
        "JEE Main 2025 Session 2 Hall Ticket",
        "UPSC Prelims 2025 Admit Card Link",
        "CUET UG 2025 City Intimation Slip",
        "GATE 2025 Admit Card (Feb Session)",
        "NDA I 2025 Hall Ticket Out Now"
      ]
    },
    {
      title: "Latest Notifications",
      icon: Calendar,
      color: "text-rose-500",
      border: "border-rose-500/50",
      items: [
        "SSC CGL 2025 Official Notification",
        "RRB NTPC 10,000+ Vacancies Announced",
        "AFCAT 02/2025 Online Registration",
        "BITSAT 2025 Applied Window Open",
        "RBI Grade B 2025 Phase I Date"
      ],
      isNew: true
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Aura Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto py-16 px-4 max-w-7xl relative z-10">
        <motion.div 
          initial="initial"
          animate="animate"
          className="mb-16 text-center"
        >
          <motion.div variants={fadeInUp} className="flex justify-center mb-6">
            <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary backdrop-blur-md rounded-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Real-time Academic Updates
            </Badge>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none"
          >
            Exam <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400">Command</span> Center
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium"
          >
            Track every result, admit card, and upcoming notification across India's academic landscape.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section, idx) => (
            <motion.section 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <div className={cn("flex items-center gap-3 mb-6 pb-2 border-b-2 transition-all group", section.border)}>
                <section.icon className={cn("w-6 h-6 group-hover:scale-110 transition-transform", section.color)} />
                <h2 className="text-2xl font-bold tracking-tight">{section.title}</h2>
              </div>
              
              <div className="flex flex-col gap-4">
                {section.items.map((item, i) => (
                  <Link 
                    key={i} 
                    href="/exams/details" 
                    className="group relative block p-4 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/50 hover:border-primary/50 hover:bg-card/60 transition-all duration-300 shadow-lg hover:shadow-primary/5"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-sm md:text-base font-semibold text-slate-200 group-hover:text-primary transition-colors leading-tight">
                        {item}
                      </span>
                      {section.isNew && i < 2 && (
                        <Badge className="bg-rose-500 text-[10px] px-1.5 py-0 h-4 min-w-fit shadow-lg shadow-rose-500/20">NEW</Badge>
                      )}
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 text-center"
        >
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Link 
              href="/exams/directory" 
              className="relative flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 h-16 rounded-full font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20"
            >
              Access Global Exams Directory <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="mt-8 flex justify-center gap-12 text-muted-foreground font-medium text-sm lg:text-base">
             <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span>Instant Alerts</span>
             </div>
             <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-500" />
                <span>Verified Data</span>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
