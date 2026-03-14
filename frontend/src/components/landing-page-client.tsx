"use client";

import Link from 'next/link';
import { 
  ArrowRight, 
  BookOpen, 
  Users, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles,
  DollarSign,
  Globe,
  Award,
  Instagram,
  MessageCircle,
  Send,
  Zap,
  TrendingUp,
  Cpu
} from 'lucide-react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { Scholarship } from '@/types';

interface LandingPageProps {
  scholarships: Scholarship[];
  stats: {
    students: number;
    universities: number;
    scholarshipsValue: string;
    resources: number;
  };
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export function LandingPageClient({ scholarships, stats }: LandingPageProps) {
  
  const testimonials = [
    {
      quote: "USG India helped me secure a full scholarship for my engineering degree. The platform is incredibly easy to use and the resources are top-notch.",
      name: "Aditya Sharma",
      title: "Engineering Student, IIT Delhi",
    },
    {
      quote: "I found the perfect study materials for my NEET preparation here. The community support is also amazing.",
      name: "Priya Patel",
      title: "Medical Aspirant",
    },
    {
      quote: "As a university administrator, USG India has streamlined our scholarship verification process significantly.",
      name: "Dr. R.K. Gupta",
      title: "Dean, Delhi University",
    },
    {
      quote: "The best platform for finding genuine scholarship opportunities in India. Highly recommended!",
      name: "Sneha Reddy",
      title: "Student, Bangalore University",
    },
     {
      quote: "The AI recommendations were spot on. I didn't even know I was eligible for some of these grants.",
      name: "Rahul Verma",
      title: "B.Com Student",
    },
  ];

  const features = [
    {
      title: "AI Scholarship Intelligence",
      description: "Neural matching engine that scans thousands of grants to find your perfect academic funding match.",
      header: <div className="flex flex-1 w-full h-full min-h-32 rounded-xl bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-500/10 via-slate-950/40 to-slate-950/80 backdrop-blur-3xl border border-white/5 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full animate-pulse" />
      </div>,
      icon: <Cpu className="h-5 w-5 text-blue-500" />,
      className: "md:col-span-2",
    },
    {
      title: "Verified Social Cloud",
      description: "Encrypted networking for verified scholars and industry mentors.",
      header: <div className="flex-1 w-full h-full min-h-32 rounded-xl bg-slate-950/60 backdrop-blur-md border border-white/5 flex items-center justify-center">
        <Users className="w-12 h-12 text-slate-700 opacity-50" />
      </div>,
      icon: <Users className="h-5 w-5 text-indigo-500" />,
      className: "md:col-span-1",
    },
    {
      title: "Resource Citadel",
      description: "Exclusive vault containing high-fidelity study materials and career playbooks.",
      header: <div className="flex flex-1 w-full h-full min-h-32 rounded-xl bg-slate-950/60 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-2xl rounded-full" />
      </div>,
      icon: <BookOpen className="h-5 w-5 text-purple-500" />,
      className: "md:col-span-1",
    },
     {
      title: "Global Mobility Hub",
      description: "Direct pipelines to international exchange programs and masterclasses.",
      header: <div className="flex flex-1 w-full h-full min-h-32 rounded-xl bg-linear-to-br from-emerald-500/5 to-slate-950/90 border border-white/5" />,
      icon: <Globe className="h-5 w-5 text-emerald-500" />,
      className: "md:col-span-2",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#05080f] text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Cinematic Hero */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
          <div className="absolute bottom-0 left-0 w-full h-48 bg-linear-to-t from-[#05080f] to-transparent" />
          <div className="absolute inset-0 bg-grid-white/[0.02] mask-[radial-gradient(ellipse_at_center,black,transparent)]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-6xl mx-auto flex flex-col items-center text-center"
          >
            <motion.div variants={fadeInUp} className="mb-10">
              <div className="relative inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl shadow-2xl">
                 <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-50" />
                 <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                 <span className="text-sm font-black tracking-[0.2em] text-blue-400 uppercase">System Active v4.0</span>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="mb-8">
               <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-[0.8] mb-4">
                 USG <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 via-indigo-400 to-purple-500">INDIA</span>
               </h1>
               <div className="text-2xl md:text-4xl font-bold tracking-tight text-slate-400 max-w-3xl mx-auto">
                 The Premier Terminal for Indian Scholars.
               </div>
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-500 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
               An elite ecosystem engineered to accelerate your academic trajectory through <span className="text-slate-300 font-bold">intelligent funding</span>, high-fidelity mentorship, and industrial-grade networking.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full">
               <Link href="/register">
                 <Button size="lg" className="h-16 px-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xl shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-105 active:scale-95 group">
                   Initialize Profile <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                 </Button>
               </Link>
               
               <Link href="/scholarships">
                 <Button variant="outline" size="lg" className="h-16 px-12 rounded-2xl border-slate-800 bg-slate-950/50 hover:bg-slate-900 text-slate-300 font-bold text-lg backdrop-blur-xl transition-all hover:border-slate-700">
                   Explore Intelligence
                 </Button>
               </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Industrial Stats Bar */}
      <section className="relative z-20 px-4 -mt-16 mb-32">
        <div className="container mx-auto">
          <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800/60 rounded-[2.5rem] p-10 md:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { label: 'Active Scholars', value: `${stats.students.toLocaleString()}+`, icon: Users, color: 'text-blue-500' },
                { label: 'Integrations', value: `${stats.universities}+`, icon: GraduationCap, color: 'text-indigo-500' },
                { label: 'Capital Deployed', value: stats.scholarshipsValue, icon: Award, color: 'text-emerald-500' },
                { label: 'Resource Nodes', value: `${stats.resources}+`, icon: BookOpen, color: 'text-purple-500' }
              ].map((stat, i) => (
                <div key={i} className="group relative">
                  <div className="flex flex-col items-center">
                    <stat.icon className={cn("w-6 h-6 mb-4 opacity-50 group-hover:opacity-100 transition-opacity", stat.color)} />
                    <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 group-hover:scale-110 transition-transform">{stat.value}</div>
                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Architecture */}
      <section className="py-32 relative">
         <div className="container mx-auto px-4">
             <div className="text-center max-w-4xl mx-auto mb-20">
              <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-none px-4 py-1.5 font-black tracking-widest uppercase text-[10px]">Ecosystem Architecture</Badge>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Engineered for Success</h2>
              <p className="text-slate-500 text-xl font-medium leading-relaxed">
                A multi-layered infrastructure designed to automate and optimize every dimension of your academic and professional development.
              </p>
            </div>
            
            <BentoGrid className="max-w-5xl mx-auto gap-8">
              {features.map((item, i) => (
                <BentoGridItem
                  key={i}
                  title={item.title}
                  description={item.description}
                  header={item.header}
                  icon={item.icon}
                  className={cn("bg-slate-900/40 border-slate-800/60 hover:border-slate-700 hover:shadow-2xl transition-all rounded-4xl", item.className)}
                />
              ))}
            </BentoGrid>
         </div>
      </section>

      {/* Featured Intelligence Drops */}
      {scholarships && scholarships.length > 0 && (
        <section className="py-32 bg-[#080c14] relative border-y border-slate-900">
          <div className="absolute inset-0 bg-grid-blue-500/[0.01] pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-2xl">
                <Badge className="mb-6 bg-emerald-500/10 text-emerald-400 border-none px-4 py-1.5 font-black tracking-widest uppercase text-[10px]">Real-time Funding Feed</Badge>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">Active Opportunities</h2>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">Secure high-value capital through our verified institutional pipelines.</p>
              </div>
              <Button asChild variant="ghost" className="h-14 px-8 rounded-full border border-slate-800 text-slate-300 hover:bg-slate-800 font-bold text-lg transition-all">
                <Link href="/scholarships">Open Terminal <TrendingUp className="ml-3 w-5 h-5 text-emerald-500" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {scholarships.map((scholarship) => (
                <Card key={scholarship.id} className="group bg-slate-900/30 backdrop-blur-xl border-slate-800/60 hover:border-blue-500/50 hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)] transition-all duration-500 rounded-4xl overflow-hidden">
                  <div className="h-2 w-full bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="pt-8 px-8">
                    <div className="mb-4">
                       <Badge variant="secondary" className="bg-slate-800 text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors py-1 px-4">{scholarship.category || 'General Capital'}</Badge>
                    </div>
                    <CardTitle className="text-2xl font-black text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors uppercase tracking-tight">{scholarship.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 space-y-6">
                    <div className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-widest">
                       <Users className="w-4 h-4 mr-3 text-slate-600" /> {scholarship.provider || 'Institutional Node'}
                    </div>
                    <div className="flex items-center text-4xl font-black text-emerald-400 tracking-tighter">
                       <DollarSign className="w-8 h-8 mr-1 text-emerald-600 opacity-50" /> {scholarship.amount || 'Variable'}
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 pt-0">
                    <Button asChild className="w-full h-14 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white transition-all rounded-2xl font-black uppercase tracking-widest text-xs">
                      <Link href={`/scholarships/${scholarship.id}`}>View Protocol</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Infinite Proof Cards */}
      <section className="py-32 bg-[#05080f] overflow-hidden relative border-b border-slate-900">
          <div className="container mx-auto px-4 mb-20 text-center">
             <Badge className="mb-6 bg-slate-900 text-slate-500 border-none px-4 py-1.5 font-black tracking-widest uppercase text-[10px]">Global Validation</Badge>
             <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Elite Testimonials</h2>
             <p className="text-slate-500 text-xl font-medium">Join a network of high-achievers already operating at scale.</p>
          </div>
          <div className="relative">
             <div className="absolute left-0 top-0 bottom-0 w-48 bg-linear-to-r from-[#05080f] to-transparent z-10" />
             <div className="absolute right-0 top-0 bottom-0 w-48 bg-linear-to-l from-[#05080f] to-transparent z-10" />
             <InfiniteMovingCards
               items={testimonials}
               direction="right"
               speed="slow"
               className="dark:bg-grid-white/[0.05]"
             />
          </div>
      </section>

      {/* Global Community Node */}
      <section className="py-40 relative">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-purple-500/10 text-purple-400 border-none px-4 py-1.5 font-black tracking-widest uppercase text-[10px]">Network Expansion</Badge>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tighter leading-none">Join the Global Node</h2>
          <p className="text-slate-500 text-xl font-medium max-w-3xl mx-auto mb-24">
            Connect to our secure communication channels for prioritized alerts and tactical academic intel.
          </p>

          <div className="flex flex-wrap justify-center gap-12">
            {[
              { icon: Send, label: 'Telegram', color: 'text-blue-500', bg: 'bg-blue-500/10', shadow: 'shadow-blue-500/20', url: 'https://t.me/usgindia' },
              { icon: ({className}: {className?: string}) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, label: 'X (Twitter)', color: 'text-white', bg: 'bg-white/5', shadow: 'shadow-white/5', url: 'https://x.com/USGINDIA' },
              { icon: Instagram, label: 'Instagram', color: 'text-pink-500', bg: 'bg-pink-500/10', shadow: 'shadow-pink-500/20', url: 'https://www.instagram.com/usgindia/' },
              { icon: MessageCircle, label: 'WhatsApp', color: 'text-green-500', bg: 'bg-green-500/10', shadow: 'shadow-green-500/20', url: 'https://www.whatsapp.com/channel/0029Vb6O5qb7YSd4SxGLUt0s' }
            ].map((social, i) => (
              <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="group relative flex flex-col items-center gap-6">
                 <div className={cn("relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl group-hover:-translate-y-4 transition-all duration-500 group-hover:bg-slate-800 shadow-2xl overflow-hidden", social.shadow)}>
                    <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700", social.bg)} />
                    <social.icon className={cn("w-10 h-10 md:w-12 md:h-12 relative z-10 transition-all duration-500 group-hover:scale-125", social.color)} />
                 </div>
                 <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 group-hover:text-white transition-colors">{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Maximum Impact CTA */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-slate-900/60 backdrop-blur-3xl border border-slate-800/80 rounded-[4rem] px-8 py-24 md:py-32 text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
            <div className="absolute -top-24 -right-24 opacity-[0.03]">
              <Zap className="w-96 h-96 text-white rotate-12" />
            </div>
            
            <div className="relative z-10 max-w-5xl mx-auto">
              <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-[0.02em] text-white leading-tight">ASCEND TO YOUR <br/><span className="text-blue-500 italic">NEXT PHASE.</span></h2>
              <p className="text-slate-400 text-xl md:text-2xl mb-16 leading-relaxed max-w-3xl mx-auto font-medium">
                The terminal is open. Join the thousands of elite students already leveraging USG India to gain the ultimate competitive advantage.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Button asChild size="lg" className="h-20 px-16 rounded-3xl bg-white text-black hover:bg-slate-200 font-black text-2xl shadow-[0_0_50px_-5px_rgba(255,255,255,0.4)] transition-all">
                  <Link href="/register">IDENTIFY & JOIN</Link>
                </Button>
              </motion.div>
              
              <div className="mt-20 flex flex-wrap items-center justify-center gap-12 grayscale opacity-40">
                <div className="flex items-center gap-3">
                   <ShieldCheck className="w-5 h-5" /> 
                   <span className="text-xs font-black uppercase tracking-widest">Enterprise Security</span>
                </div>
                <div className="flex items-center gap-3">
                   <Zap className="w-5 h-5" /> 
                   <span className="text-xs font-black uppercase tracking-widest">Real-time Data</span>
                </div>
                <div className="flex items-center gap-3">
                   <Globe className="w-5 h-5" /> 
                   <span className="text-xs font-black uppercase tracking-widest">Global Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Terminal Footer */}
      <footer className="py-20 border-t border-slate-900 text-center">
        <div className="container mx-auto px-4">
           <div className="flex flex-col items-center gap-8">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-slate-900 rounded-xl border border-slate-800 p-2">
                    <Image src="/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
                 </div>
                 <span className="text-xl font-black tracking-tighter text-white">USG INDIA SYSTEM</span>
              </div>
              <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.5em] mt-4">
                &copy; {new Date().getFullYear()} USG INDIA &bull; SECURE TERMINAL &bull; ENCRYPTED SESSION &bull; ALL RIGHTS RESERVED
              </p>
           </div>
        </div>
      </footer>
    </div>
  );
}
