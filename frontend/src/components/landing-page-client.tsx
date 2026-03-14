"use client";

import Link from 'next/link';
import { 
  ArrowRight, 
  BookOpen, 
  Users, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  DollarSign,
  Search,
  Globe,
  Award,
  Instagram,
  MessageCircle,
  Send
} from 'lucide-react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
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
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
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
      title: "Smart Scholarship Finder",
      description: "Our AI-driven engine matches your profile with thousands of state, central, and private scholarships.",
      header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10" />,
      icon: <Search className="h-4 w-4 text-blue-500" />,
      className: "md:col-span-2",
    },
    {
      title: "Verified Community",
      description: "Connect with verified peers, mentors, and alumni. A safe space for collaboration.",
      header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/10" />,
      icon: <Users className="h-4 w-4 text-indigo-500" />,
      className: "md:col-span-1",
    },
    {
      title: "Elite Study Vault",
      description: "Access premium study materials, expert notes, and curated past papers.",
      header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/10" />,
      icon: <BookOpen className="h-4 w-4 text-purple-500" />,
      className: "md:col-span-1",
    },
     {
      title: "Global Opportunities",
      description: "Find international scholarships and exchange programs tailored for Indian students.",
      header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-white/10" />,
      icon: <Globe className="h-4 w-4 text-emerald-500" />,
      className: "md:col-span-2",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 lg:pt-0">
        <div className="absolute inset-0 z-0 bg-grid-slate-100 dark:bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,black)]">
           {/* Modern Animated Gradient Background */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-5xl mx-auto flex flex-col items-center"
          >
            <motion.div variants={fadeInUp} className="mb-8 relative w-24 h-24 md:w-32 md:h-32">
               <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full" />
               <Image
                 src="/logo.png"
                 alt="USG India Logo"
                 fill
                 className="object-contain relative z-10 drop-shadow-xl"
                 priority
               />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-8 border-primary/20 text-primary px-6 py-2 text-sm bg-primary/5 backdrop-blur-md rounded-full shadow-sm hover:bg-primary/10 transition-colors cursor-default">
                <Sparkles className="w-4 h-4 mr-2 text-accent" />
                India&apos;s #1 Student Empowerment Platform
              </Badge>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="mb-6 space-y-4">
               <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground">
                Shape Your
               </h1>
               <div className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-accent pb-2">
                  <TextGenerateEffect words="Future Today" className="inline-block" />
               </div>
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
              Unlock your potential with <span className="text-foreground font-semibold">exclusive scholarships</span>, expert mentorship, and a thriving community of achievers.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button asChild size="lg" className="w-full rounded-full px-8 h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all">
                  <Link href="/register" className="flex items-center justify-center">
                    Get Started <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button asChild variant="outline" size="lg" className="w-full rounded-full px-8 h-14 text-base font-semibold border-border bg-background/50 hover:bg-secondary text-foreground backdrop-blur-sm transition-all shadow-sm">
                  <Link href="/scholarships" className="flex items-center justify-center">
                    Explore Opportunities
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Floating Stats Bar */}
      <section className="relative -mt-20 z-20 px-4 mb-20">
        <div className="container mx-auto">
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x divide-border/50">
              {[
                { label: 'Active Students', value: `${stats.students.toLocaleString()}+`, icon: Users },
                { label: 'Universities', value: `${stats.universities}+`, icon: GraduationCap },
                { label: 'Scholarships', value: stats.scholarshipsValue, icon: Award },
                { label: 'Resources', value: `${stats.resources}+`, icon: BookOpen }
              ].map((stat, i) => (
                <div key={i} className="group pl-4 md:pl-0 first:pl-0">
                  <div className="flex items-center justify-center gap-2 mb-2">
                     <stat.icon className="w-5 h-5 text-primary opacity-70 group-hover:opacity-100 transition-opacity" />
                     <div className="text-3xl md:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">{stat.value}</div>
                  </div>
                  <div className="text-muted-foreground text-xs md:text-sm font-medium uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 bg-background relative">
         <div className="container mx-auto px-4">
             <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary">WHY CHOOSE US</Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Everything You Need to Succeed</h2>
              <p className="text-muted-foreground text-lg">
                We&apos;ve built a comprehensive ecosystem designed to support every step of your academic journey.
              </p>
            </div>
            
            <BentoGrid className="max-w-4xl mx-auto">
              {features.map((item, i) => (
                <BentoGridItem
                  key={i}
                  title={item.title}
                  description={item.description}
                  header={item.header}
                  icon={item.icon}
                  className={cn("bg-card border-border hover:shadow-lg transition-shadow", item.className)}
                />
              ))}
            </BentoGrid>
         </div>
      </section>

      {/* Featured Scholarships */}
      {scholarships && scholarships.length > 0 && (
        <section className="py-24 bg-secondary/30 relative border-t border-border/50">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0))]" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div className="max-w-2xl">
                <Badge variant="outline" className="mb-4 border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400">LATEST DROPS</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Scholarships</h2>
                <p className="text-muted-foreground text-lg">Apply for the latest financial aid programs verified by our team.</p>
              </div>
              <Button asChild variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                <Link href="/scholarships">View All <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scholarships.map((scholarship) => (
                <Card key={scholarship.id} className="group bg-card border-border hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="h-1.5 w-full bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                       <Badge variant="secondary" className="bg-secondary text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">{scholarship.category || 'General'}</Badge>
                    </div>
                    <CardTitle className="text-xl text-foreground line-clamp-2 group-hover:text-primary transition-colors">{scholarship.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                       <Users className="w-4 h-4 mr-2" /> {scholarship.provider || 'USG India'}
                    </div>
                    <div className="flex items-center text-lg font-bold text-green-600 dark:text-green-400">
                       <DollarSign className="w-5 h-5 mr-1" /> {scholarship.amount || 'Variable'}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors font-medium">
                      <Link href={`/scholarships/${scholarship.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
             <div className="mt-8 text-center md:hidden">
              <Button asChild variant="outline" className="w-full border-border text-foreground bg-card">
                <Link href="/scholarships">View All Scholarships</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Infinite Moving Cards (Testimonials) */}
      <section className="py-24 bg-background overflow-hidden relative">
          <div className="container mx-auto px-4 mb-12 text-center">
             <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Trusted by Thousands</h2>
             <p className="text-muted-foreground text-lg">Join a community of ambitious students shaping the future.</p>
          </div>
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
            className="dark:bg-grid-white/[0.05]"
          />
      </section>

      {/* Social Community Section */}
      <section className="py-24 bg-card relative border-y border-border">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 border-purple-500/20 bg-purple-500/5 text-purple-600 dark:text-purple-400">JOIN THE MOVEMENT</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Connect With Our Community</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
            Stay updated with the latest scholarship alerts, exam notifications, and success stories.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <a href="https://t.me/usgindia" target="_blank" rel="noopener noreferrer" className="group relative">
               <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-background border border-border rounded-2xl group-hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                  <Send className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
               </div>
               <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Telegram</span>
            </a>

            <a href="https://x.com/USGINDIA" target="_blank" rel="noopener noreferrer" className="group relative">
               <div className="absolute inset-0 bg-foreground/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-background border border-border rounded-2xl group-hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                  <svg className="w-8 h-8 text-foreground group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
               </div>
               <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Twitter</span>
            </a>

            <a href="https://www.instagram.com/usgindia/" target="_blank" rel="noopener noreferrer" className="group relative">
               <div className="absolute inset-0 bg-pink-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-background border border-border rounded-2xl group-hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                  <Instagram className="w-8 h-8 text-pink-500 group-hover:scale-110 transition-transform" />
               </div>
               <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Instagram</span>
            </a>

            <a href="https://www.whatsapp.com/channel/0029Vb6O5qb7YSd4SxGLUt0s" target="_blank" rel="noopener noreferrer" className="group relative">
               <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-background border border-border rounded-2xl group-hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                  <MessageCircle className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
               </div>
               <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-card/80 backdrop-blur-md border border-border rounded-[3rem] p-12 md:p-24 text-center text-foreground relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <GraduationCap className="w-96 h-96 rotate-12 text-foreground" />
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Ready to Elevate Your <br/> Academic Life?</h2>
              <p className="text-muted-foreground text-xl md:text-2xl mb-12 leading-relaxed max-w-2xl mx-auto">
                Join thousands of students who are already using USG India to gain a competitive edge and shape their future.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-12 h-16 font-bold text-lg shadow-xl transition-all">
                    <Link href="/register">Create Free Account</Link>
                  </Button>
                </motion.div>
              </div>
              <div className="mt-12 flex items-center justify-center gap-8 text-muted-foreground text-sm font-medium">
                <div className="flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4 text-green-500" /> 
                   <span>Free Forever for Students</span>
                </div>
                <div className="flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-primary" /> 
                   <span>Data Privacy Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer is usually handled by layout, but if we need a specific footer for landing page we could add it here or ensure the global footer looks good on dark mode */}
    </div>
  );
}
