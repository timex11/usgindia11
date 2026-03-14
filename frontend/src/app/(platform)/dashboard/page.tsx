"use client";

import { useDashboard } from '@/hooks/useDashboard';
import { Overview } from '@/components/dashboard/overview';
import { CommandMenu } from '@/components/dashboard/command-menu';
import { AnimatedCard, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/animated-card';
import { useAuthStore } from '@/store/useAuthStore';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  TrendingUp,
  Download,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { MotionContainer } from '@/components/ui/motion-container';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data, isLoading: loading } = useDashboard();

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-10 w-64 bg-secondary rounded-lg" />
          <div className="h-10 w-32 bg-secondary rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
          <Skeleton className="lg:col-span-4 h-[400px] rounded-xl" />
          <Skeleton className="lg:col-span-3 h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalApplications: 0,
    activeExams: 0,
    completedExams: 0,
    averageScore: 0,
  };

  const recentActivity = data?.activity || [];

  return (
    <MotionContainer className="flex-1 space-y-8 p-8 pt-6 bg-[#05080f]/50 min-h-screen">
      <CommandMenu />
      
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white">Console</h2>
          <p className="text-slate-500 font-medium">
            Welcome back, <span className="text-blue-400 font-bold">{user?.fullName || 'Scholar'}</span>. All systems operational.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="hidden sm:flex">
            <Calendar className="mr-2 h-4 w-4" />
            Jan 20, 2024 - Feb 09, 2024
          </Button>
          <Button className="shadow-lg shadow-primary/20">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
          <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AnimatedCard delay={0.1}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Applications
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalApplications}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </AnimatedCard>
            
            <AnimatedCard delay={0.2}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Exams
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeExams}</div>
                <p className="text-xs text-muted-foreground">
                  2 exams closing soon
                </p>
              </CardContent>
            </AnimatedCard>
            
            <AnimatedCard delay={0.3}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedExams}</div>
                <p className="text-xs text-muted-foreground">
                  +12 since last week
                </p>
              </CardContent>
            </AnimatedCard>
            
            <AnimatedCard delay={0.4}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Score
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageScore}%</div>
                <p className="text-xs text-muted-foreground">
                  Top 5% of students
                </p>
              </CardContent>
            </AnimatedCard>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <AnimatedCard className="col-span-4" delay={0.5}>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  Your academic performance over the last 12 months.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </AnimatedCard>
            
            <AnimatedCard className="col-span-3" delay={0.6}>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  You completed {stats.completedExams} exams this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentActivity.length > 0 ? (
                    recentActivity.slice(0, 5).map((item, i) => (
                      <div key={item.id} className="flex items-center group">
                        <div className="relative mr-4">
                           <span className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-background bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors`}>
                             {item.type === 'exam' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                           </span>
                           {i !== recentActivity.length - 1 && (
                             <span className="absolute left-1/2 top-9 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                           )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="ml-auto font-medium text-xs">
                           <Badge variant={item.status === 'completed' ? 'secondary' : 'outline'}>{item.status}</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">No recent activity</div>
                  )}
                </div>
              </CardContent>
            </AnimatedCard>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <AnimatedCard delay={0.1}>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Stay updated with your latest alerts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.notifications && data.notifications.length > 0 ? (
                  data.notifications.map((n) => (
                    <div key={n.id} className={cn(
                      "flex flex-col gap-1 p-4 rounded-lg border transition-colors",
                      n.isRead ? "bg-background" : "bg-primary/5 border-primary/20"
                    )}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{n.title}</h4>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No notifications yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </AnimatedCard>
        </TabsContent>
      </Tabs>
    </MotionContainer>
  );
}
