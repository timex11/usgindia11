"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Share2, Heart, Users, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function CommunityLandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Abstract background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto py-24 px-4 max-w-7xl relative z-10">
        <motion.div 
          initial="initial"
          animate="animate"
          className="text-center mb-20"
        >
          <motion.div variants={fadeInUp} className="flex justify-center mb-6">
            <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary backdrop-blur-md rounded-full">
              <Users className="w-4 h-4 mr-2" />
              Join 50,000+ Students
            </Badge>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none"
          >
            Vibrant <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-purple-500 to-accent">Student</span> <br/> Community
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 font-medium"
          >
            Connect, collaborate, and grow together in a space built exclusively for the next generation of Indian achievers.
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6"
          >
            <Button size="lg" className="rounded-full px-10 h-16 text-lg font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
              Launch Community <Sparkles className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg font-bold border-border bg-background/50 backdrop-blur-md hover:bg-secondary transition-all hover:scale-105 active:scale-95">
              Browse Discussions
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { 
              title: "Expert Forums", 
              desc: "Deep dives into coding, medical, UPSC, and creative arts led by industry mentors.", 
              icon: MessageCircle, 
              color: "text-primary",
              bg: "bg-primary/10"
            },
            { 
              title: "Study Groups", 
              desc: "Find your squad for late-night sessions and collaborative project building.", 
              icon: Share2, 
              color: "text-blue-500",
              bg: "bg-blue-500/10"
            },
            { 
              title: "Peer Support", 
              desc: "A judgment-free zone for mental health, career advice, and friendship.", 
              icon: Heart, 
              color: "text-red-500",
              bg: "bg-red-500/10"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group relative h-full bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative z-10">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110", item.bg)}>
                    <item.icon className={cn("w-7 h-7", item.color)} />
                  </div>
                  <CardTitle className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground text-lg leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <section className="relative rounded-[3rem] p-12 md:p-24 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background to-accent/10 z-0" />
          <div className="absolute inset-0 bg-grid-white/[0.02] z-0" />
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Ready to join the <span className="text-primary italic">future?</span></h2>
            <p className="mb-12 text-xl md:text-2xl text-muted-foreground font-medium">
              Registration takes 30 seconds. Access all forums, study groups, and mentorship programs for free.
            </p>
            <Link href="/join">
              <Button size="lg" className="rounded-full px-12 h-16 text-xl font-bold group shadow-2xl shadow-primary/30">
                Join Community Now <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

// Helper for class names if needed
function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
