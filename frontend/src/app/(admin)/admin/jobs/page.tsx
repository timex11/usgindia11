"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Check, X, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { MotionContainer } from "@/components/ui/motion-container";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salaryRange: string;
  createdAt: string;
}

interface Application {
  id: string;
  status: string;
  appliedAt: string;
  job: {
    title: string;
    company: string;
  };
  applicant: {
    fullName: string;
    email: string;
  };
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { get, patch, del } = useApi();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [jData, aData] = await Promise.all([
        get<{ data: Job[] }>('/jobs'),
        get<Application[]>('/jobs/applications')
      ]);
      setJobs(jData.data || []);
      setApplications(aData || []);
    } catch (err) {
      toast.error("Failed to load data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [get]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await patch(`/jobs/applications/${id}/status`, { status });
      toast.success(`Application ${status}`);
      fetchData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await del(`/jobs/${id}`);
      toast.success("Job deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete job");
    }
  };

  return (
    <MotionContainer className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Jobs</h1>
          <p className="text-muted-foreground mt-1">Post new roles and manage student applications.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Post Job
        </Button>
      </div>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="jobs">Job Listings</TabsTrigger>
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search roles or companies..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((j) => (
                    <TableRow key={j.id}>
                      <TableCell className="font-medium">{j.title}</TableCell>
                      <TableCell>{j.company}</TableCell>
                      <TableCell>{j.location}</TableCell>
                      <TableCell><Badge variant="outline">{j.type}</Badge></TableCell>
                      <TableCell className="text-green-600 font-semibold">{j.salaryRange}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteJob(j.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Job & Company</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{app.applicant.fullName}</span>
                          <span className="text-xs text-muted-foreground">{app.applicant.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{app.job.title}</span>
                          <span className="text-xs text-muted-foreground">{app.job.company}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(app.appliedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={app.status === 'pending' ? 'secondary' : app.status === 'accepted' ? 'default' : 'destructive'}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {app.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(app.id, 'accepted')} className="text-green-600"><Check className="h-4 w-4 mr-1" /> Approve</Button>
                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(app.id, 'rejected')} className="text-destructive"><X className="h-4 w-4 mr-1" /> Reject</Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MotionContainer>
  );
}
