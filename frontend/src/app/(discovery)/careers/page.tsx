"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, ArrowRight, Sparkles, TrendingUp, Code, Landmark, Stethoscope, Microscope } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function CareersPage() {
  const categories = [
    { title: "Technology", icon: Code, color: "text-blue-500", bg: "bg-blue-500/10", count: 124 },
    { title: "Public Service", icon: Landmark, color: "text-amber-500", bg: "bg-amber-500/10", count: 86 },
    { title: "Healthcare", icon: Stethoscope, color: "text-emerald-500", bg: "bg-emerald-500/10", count: 42 },
    { title: "Reseach & Dev", icon: Microscope, color: "text-purple-500", bg: "bg-purple-500/10", count: 31 },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto py-24 px-4 max-w-7xl relative z-10">
        <motion.div 
          initial="initial"
          animate="animate"
          className="text-center mb-20"
        >
          <motion.div variants={fadeInUp} className="flex justify-center mb-6">
            <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary backdrop-blur-md rounded-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Career Guidance & Pathways
            </Badge>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none"
          >
            Design Your <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-500">Career</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 font-medium"
          >
            Expertly curated career paths for Indian students. From corporate giants to administrative excellence.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group bg-card/40 backdrop-blur-xl border-border/50 hover:border-primary/50 hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", cat.bg)}>
                    <cat.icon className={cn("w-6 h-6", cat.color)} />
                  </div>
                  <CardTitle className="text-xl font-bold">{cat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm font-medium text-muted-foreground mb-4">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                    {cat.count} Pathways Available
                  </div>
                  <Button variant="ghost" className="w-full justify-between hover:bg-primary/10 hover:text-primary transition-all">
                    Explore Now <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <section className="relative rounded-[3rem] p-12 bg-slate-900 shadow-2xl overflow-hidden border border-slate-800">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Briefcase className="w-64 h-64 text-slate-100" />
           </div>
           
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-6">NEW FEATURE</Badge>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">AI Career Counselor</h2>
                <p className="text-slate-400 text-lg md:text-xl mb-8 leading-relaxed">
                  Not sure where to start? Our Generative AI analyzes your skills, interests, and academic background to suggest the perfect career path for 2025.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="rounded-full px-8 h-14 text-lg font-bold bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20">
                    Get Free Assessment
                  </Button>
                  <Button variant="ghost" size="lg" className="rounded-full px-8 h-14 text-lg font-bold text-white hover:bg-white/10">
                    Learn How it Works
                  </Button>
                </div>
              </div>
              
               <div className="hidden lg:flex justify-center">
                 <div className="w-full aspect-square max-w-[400px] rounded-3xl bg-linear-to-br from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center backdrop-blur-2xl relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                    </div>
                    <Sparkles className="w-32 h-32 text-blue-400 relative z-10" />
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
