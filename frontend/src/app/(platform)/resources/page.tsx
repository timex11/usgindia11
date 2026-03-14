'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { BookOpen, Download, Search, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Resource {
  id: string;
  title: string;
  type: 'notes' | 'guess_paper' | 'syllabus';
  subject: string;
  file_url: string;
  university_id: string;
  universities?: { name: string };
}

interface University {
  id: string;
  name: string;
}

export default function ResourceLibraryPage() {
  const { get, loading } = useApi();
  const [resources, setResources] = useState<Resource[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [uniFilter, setUniFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resData, uniData] = await Promise.all([
          get<Resource[]>('/resources'),
          get<University[]>('/institutions')
        ]);
        setResources(Array.isArray(resData) ? resData : []);
        setUniversities(Array.isArray(uniData) ? uniData : []);
      } catch {}
    };
    fetchData();
  }, [get]);

  const filtered = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) || 
                          res.subject.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || res.type === typeFilter;
    const matchesUni = uniFilter === "all" || res.university_id === uniFilter;
    return matchesSearch && matchesType && matchesUni;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Resource Library</h1>
          <p className="text-muted-foreground">Access notes, guess papers, and syllabi for your courses.</p>
        </div>
        <Button className="gap-2">
          <BookOpen className="w-4 h-4" />
          Upload Resource
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search by title or subject..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="notes">Notes</SelectItem>
            <SelectItem value="guess_paper">Guess Paper</SelectItem>
            <SelectItem value="syllabus">Syllabus</SelectItem>
          </SelectContent>
        </Select>
        <Select value={uniFilter} onValueChange={setUniFilter}>
          <SelectTrigger>
            <SelectValue placeholder="University" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Universities</SelectItem>
            {universities.map(u => (
              <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[180px] w-full" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(resource => (
            <Card key={resource.id} className="hover:border-slate-400 transition-colors border-slate-200 flex flex-col h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge className={
                    resource.type === 'notes' ? 'bg-blue-100 text-blue-800' :
                    resource.type === 'guess_paper' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {resource.type.replace('_', ' ')}
                  </Badge>
                  <Button variant="ghost" size="icon" asChild className="text-slate-400 hover:text-indigo-600">
                    <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-5 h-5" />
                    </a>
                  </Button>
                </div>
                <CardTitle className="text-xl mt-2 line-clamp-1">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-slate-600">{resource.subject}</p>
              </CardContent>
              <CardFooter className="pt-2 border-t text-xs text-slate-400">
                <div className="flex items-center">
                  <Building className="w-3 h-3 mr-1" />
                  {resource.universities?.name || 'Academic Portal'}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500">No resources found matching your search.</p>
        </div>
      )}
    </div>
  );
}
