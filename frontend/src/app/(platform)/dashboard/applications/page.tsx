"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Calendar, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { MotionContainer } from "@/components/ui/motion-container";
import { toast } from "sonner";

interface ScholarshipApplication {
  id: string;
  status: string;
  appliedAt: string;
  scholarship: {
    id: string;
    title: string;
    provider: string;
  };
}

interface JobApplication {
  id: string;
  status: string;
  appliedAt: string;
  job: {
    id: string;
    title: string;
    company: string;
  };
}

export default function ApplicationsPage() {
  const [scholarshipApps, setScholarshipApps] = useState<ScholarshipApplication[]>([]);
  const [jobApps, setJobApps] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { get } = useApi();

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const [sApps, jApps] = await Promise.all([
        get<ScholarshipApplication[]>('/scholarships/my-applications'),
        get<JobApplication[]>('/jobs/my-applications')
      ]);
      setScholarshipApps(sApps || []);
      setJobApps(jApps || []);
    } catch (err) {
      toast.error("Failed to load applications");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [get]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
      case 'accepted':
      case 'approved':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MotionContainer className="container mx-auto py-8 px-4 max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground mt-1">Track the status of your scholarship and job applications.</p>
      </div>

      <Tabs defaultValue="scholarships" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="scholarships" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" /> Scholarships
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Jobs
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your applications...</p>
          </div>
        ) : (
          <>
            <TabsContent value="scholarships" className="space-y-4">
              {scholarshipApps.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium">No scholarship applications yet</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                      Browse our scholarship directory to find opportunities that match your profile.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                scholarshipApps.map((app) => (
                  <Card key={app.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{app.scholarship.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            {app.scholarship.provider}
                          </CardDescription>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4">
              {jobApps.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium">No job applications yet</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                      Explore our career portal to find your next professional opportunity.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                jobApps.map((app) => (
                  <Card key={app.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{app.job.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            {app.job.company}
                          </CardDescription>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </MotionContainer>
  );
}
