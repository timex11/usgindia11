"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, GraduationCap, Calendar, DollarSign, ArrowUpRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  category: string;
  amount: string;
  deadline: string;
  description: string;
  matchScore?: number;
}

export default function ScholarshipFinderPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { token } = useAuthStore();

  const fetchScholarships = async () => {
    setIsLoading(true);
    try {
      const url = search 
        ? `${process.env.NEXT_PUBLIC_API_URL}/scholarships?search=${search}`
        : `${process.env.NEXT_PUBLIC_API_URL}/scholarships`;
        
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json() as { data: Scholarship[] };
        setScholarships(data.data);
      }
    } catch {
      toast.error("Failed to load scholarships");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholarships/matches`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json() as Scholarship[];
        setScholarships(data);
        toast.success("Found your best matches!");
      }
    } catch {
      toast.error("Failed to fetch matches");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
     
  }, [token, search]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scholarship Finder</h1>
          <p className="text-muted-foreground mt-1">AI-powered financial aid discovery engine.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by title, category..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={fetchMatches} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Sparkles className="w-4 h-4 mr-2" /> Find Best Matches
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
          <p className="text-slate-500 font-medium">Analyzing database...</p>
        </div>
      ) : scholarships.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <GraduationCap className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No scholarships found</h3>
          <p className="text-slate-500 max-w-xs mx-auto mt-2">Try broad search terms or check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id} className="flex flex-col group hover:shadow-xl transition-all duration-300 border-slate-100 overflow-hidden">
              {scholarship.matchScore && scholarship.matchScore > 0 && (
                <div className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 text-center">
                  {scholarship.matchScore}% Match
                </div>
              )}
              <CardHeader className="pb-4">
                <Badge variant="secondary" className="w-fit mb-2 bg-slate-100 text-slate-600 border-none">
                  {scholarship.category}
                </Badge>
                <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors line-clamp-2">
                  {scholarship.title}
                </CardTitle>
                <CardDescription className="font-medium text-slate-900">
                  {scholarship.provider}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-3 text-sm text-slate-600 mb-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span className="font-semibold text-slate-900">Up to ₹ {scholarship.amount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800" asChild>
                  <a href={`/scholarships/${scholarship.id}`}>
                    View Details <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
