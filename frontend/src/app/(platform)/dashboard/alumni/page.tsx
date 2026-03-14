'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import Image from 'next/image';
import {
  Users,
  GraduationCap,
  Briefcase,
  Linkedin,
  MessageSquare,
  Search,
  Heart
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AlumniProfile {
  id: string;
  graduation_year: number;
  degree: string;
  current_company: string;
  linkedin_url: string;
  is_mentor: boolean;
  bio: string;
  expertise: string[];
  profile: {
    full_name: string;
    avatar_url: string;
  };
}

export default function AlumniPage() {
  const { get, post, loading } = useApi();
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<AlumniProfile | null>(null);
  const [mentorshipMessage, setMentorshipMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationPurpose, setDonationPurpose] = useState('Scholarship Fund');

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const data = await get<AlumniProfile[]>('/alumni/mentors');
        setAlumni(Array.isArray(data) ? data : []);
      } catch {
        // Handled by useApi
      }
    };
    fetchAlumni();
  }, [get]);

  const filteredAlumni = alumni.filter((person) => {
    const searchLower = search.toLowerCase();
    const fullName = person.profile?.full_name?.toLowerCase() || "";
    const company = person.current_company?.toLowerCase() || "";
    const expertise = person.expertise || [];
    
    return (
      fullName.includes(searchLower) ||
      company.includes(searchLower) ||
      expertise.some(skill => skill.toLowerCase().includes(searchLower))
    );
  });

  const handleMentorshipRequest = async () => {
    if (!selectedMentor || !mentorshipMessage) return;

    setIsSubmitting(true);
    try {
      await post('/alumni/mentorship-request', {
        mentorId: selectedMentor.id,
        message: mentorshipMessage,
      });
      toast.success(`Mentorship request sent to ${selectedMentor.profile.full_name}!`);
      setSelectedMentor(null);
      setMentorshipMessage('');
    } catch {
      // Handled by useApi
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await post('/alumni/donation', {
        amount: parseFloat(donationAmount),
        purpose: donationPurpose,
      });
      toast.success('Thank you for your donation intent! We will contact you soon.');
      setDonationAmount('');
    } catch {
      // Handled by useApi
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Global Alumni Network</h1>
          <p className="text-muted-foreground">Connect with successful alumni and find mentors for your career journey.</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          placeholder="Search by name, company, or expertise..."
          className="pl-10 h-12"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
          ))}
        </div>
      ) : filteredAlumni.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((person) => (
            <Card key={person.id} className="flex flex-col h-full hover:shadow-lg transition-shadow border-slate-200">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border">
                  {person.profile?.avatar_url ? (
                    <Image 
                      src={person.profile.avatar_url} 
                      alt={person.profile.full_name} 
                      fill 
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Users className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{person.profile?.full_name}</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {person.current_company}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-slate-600 line-clamp-2">{person.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {person.expertise?.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-[10px] bg-slate-100">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <GraduationCap className="w-3 h-3" />
                  <span>Class of {person.graduation_year} • {person.degree}</span>
                </div>
              </CardContent>
              <CardFooter className="gap-2 pt-4 border-t">
                <Button 
                  className="flex-1 gap-2" 
                  onClick={() => setSelectedMentor(person)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Connect
                </Button>
                {person.linkedin_url && (
                  <Button variant="outline" size="icon" asChild className="shrink-0">
                    <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500">No alumni found matching your search.</p>
        </div>
      )}

      {/* Support Section */}
      <Card className="bg-slate-50 border-slate-200 overflow-hidden">
        <div className="md:flex">
          <div className="p-8 md:w-2/3">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-slate-900">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              Community Support Fund
            </h2>
            <p className="text-slate-600 mb-6 max-w-2xl">
              Your contributions help provide scholarships, upgrade infrastructure, and support the next generation of students. Join our mission to empower the community.
            </p>
            <form onSubmit={handleDonation} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="Amount (₹)"
                required
                className="max-w-[150px]"
              />
              <select
                value={donationPurpose}
                onChange={(e) => setDonationPurpose(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-[200px]"
              >
                <option>Scholarship Fund</option>
                <option>Campus Development</option>
                <option>Student Welfare</option>
                <option>Other</option>
              </select>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Contribute Now"}
              </Button>
            </form>
          </div>
          <div className="hidden md:block md:w-1/3 bg-slate-200 relative">
             <div className="absolute inset-0 flex items-center justify-center">
                <Users className="w-24 h-24 text-slate-300" />
             </div>
          </div>
        </div>
      </Card>

      {/* Mentorship Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <Card className="max-w-lg w-full p-6 shadow-2xl">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Request Mentorship</CardTitle>
              <p className="text-sm text-muted-foreground pt-1">
                Connect with {selectedMentor.profile?.full_name} to seek guidance for your career.
              </p>
            </CardHeader>
            <div className="py-4">
              <textarea
                placeholder="Explain why you're seeking mentorship and what you hope to achieve..."
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-400 outline-none min-h-[120px] text-sm"
                value={mentorshipMessage}
                onChange={(e) => setMentorshipMessage(e.target.value)}
              />
            </div>
            <CardFooter className="px-0 pb-0 gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedMentor(null)}>Cancel</Button>
              <Button 
                className="flex-1" 
                onClick={handleMentorshipRequest} 
                disabled={isSubmitting || !mentorshipMessage}
              >
                {isSubmitting ? "Sending..." : "Send Request"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
