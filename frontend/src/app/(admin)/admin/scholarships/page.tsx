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

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  category: string;
  amount: string;
  deadline: string;
}

interface Application {
  id: string;
  status: string;
  appliedAt: string;
  scholarship: {
    title: string;
  };
  applicant: {
    fullName: string;
    email: string;
  };
}

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { get, patch, del } = useApi();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [sData, aData] = await Promise.all([
        get<{ data: Scholarship[] }>('/scholarships'),
        get<Application[]>('/scholarships/applications')
      ]);
      setScholarships(sData.data || []);
      setApplications(aData || []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [get]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await patch(`/scholarships/applications/${id}/status`, { status });
      toast.success(`Application ${status}`);
      fetchData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteScholarship = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scholarship?")) return;
    try {
      await del(`/scholarships/${id}`);
      toast.success("Scholarship deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete scholarship");
    }
  };

  return (
    <MotionContainer className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Scholarships</h1>
          <p className="text-muted-foreground mt-1">Create, edit, and review scholarship applications.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Scholarship
        </Button>
      </div>

      <Tabs defaultValue="scholarships" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="scholarships">All Scholarships</TabsTrigger>
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="scholarships" className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search scholarships..." 
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
                    <TableHead>Title</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scholarships.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.title}</TableCell>
                      <TableCell>{s.provider}</TableCell>
                      <TableCell><Badge variant="outline">{s.category}</Badge></TableCell>
                      <TableCell className="text-green-600 font-semibold">{s.amount}</TableCell>
                      <TableCell>{new Date(s.deadline).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteScholarship(s.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
                    <TableHead>Scholarship</TableHead>
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
                      <TableCell>{app.scholarship.title}</TableCell>
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
