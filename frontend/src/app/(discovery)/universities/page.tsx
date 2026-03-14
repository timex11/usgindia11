'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Building, MapPin, Search, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';

interface Institution {
  id: string;
  name: string;
  location: string;
  type?: 'University' | 'College';
}

export default function InstitutionsPage() {
  const { get, loading } = useApi();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const data = await get<Institution[]>('/institutions');
        setInstitutions(Array.isArray(data) ? data : []);
      } catch {}
    };
    fetchInstitutions();
  }, [get]);

  const filtered = institutions.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Universities</h1>
        <p className="text-muted-foreground">Directory of affiliated universities and colleges.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          placeholder="Search universities..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-[150px] w-full" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(inst => (
            <Link key={inst.id} href={`/universities/${inst.id}`}>
              <Card className="hover:border-indigo-400 transition-all border-slate-200 group h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Building className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform" />
                    <Badge variant="secondary">{inst.type || 'University'}</Badge>
                  </div>
                  <CardTitle className="text-xl mt-2 group-hover:text-indigo-600 transition-colors">{inst.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {inst.location}
                  </div>
                  <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500">No institutions found matching your search.</p>
        </div>
      )}
    </div>
  );
}
