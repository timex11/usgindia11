"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  MapPin, 
  Globe, 
  BookOpen, 
  Users, 
  ArrowLeft,
  Loader2,
  ExternalLink
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";
import Link from "next/link";
import Image from 'next/image';

interface College {
  id: string;
  name: string;
  code: string;
  location: string;
}

interface University {
  id: string;
  name: string;
  code: string;
  location: string;
  description: string;
  website: string;
  logoUrl: string;
  colleges: College[];
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function UniversityDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { get } = useApi();
  const [university, setUniversity] = useState<University | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        // We assume the backend can find by slug or ID
        const data = await get<University>(`/institutions/${slug}`);
        setUniversity(data);
      } catch (error) {
        toast.error("Failed to load university details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUniversity();
  }, [slug, get]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-muted-foreground">Loading university information...</p>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold">University not found</h2>
        <Button asChild className="mt-4">
          <Link href="/universities">Back to Directory</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8 px-4 space-y-8">
      <Button variant="ghost" asChild className="-ml-4">
        <Link href="/universities" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Directory
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="relative w-full md:w-32 h-32 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 border-2 border-indigo-100 overflow-hidden">
          {university.logoUrl ? (
            <Image src={university.logoUrl} alt={university.name} fill className="object-contain p-4" />
          ) : (
            <Building className="h-16 w-16 text-indigo-600" />
          )}
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{university.name}</h1>
            <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">
              {university.code}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {university.location || "Location not specified"}
            </div>
            {university.website && (
              <a 
                href={university.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
              >
                <Globe className="h-4 w-4" />
                Visit Website <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">About the University</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {university.description || "No description available for this institution."}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-indigo-600" /> Affiliated Colleges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {university.colleges && university.colleges.length > 0 ? (
                university.colleges.map((college) => (
                  <Card key={college.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{college.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {college.location}
                      </div>
                      <Badge variant="secondary" className="mt-2 text-[10px] uppercase">
                        Code: {college.code}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground col-span-full py-8 text-center bg-slate-50 rounded-xl border-2 border-dashed">
                  No affiliated colleges listed for this university.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-indigo-600 text-white border-none shadow-xl shadow-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Student Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-indigo-100 text-sm">
                If you are a student of this university, ensure your profile is verified to access exclusive scholarships and resources.
              </p>
              <Button variant="secondary" className="w-full font-bold" asChild>
                <Link href="/profile">Check Verification Status</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Colleges</span>
                <span className="font-bold">{university.colleges?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Verification</span>
                <Badge className="bg-green-500">Official Partner</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
