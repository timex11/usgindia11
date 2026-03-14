import { getScholarships } from '@/lib/api-client';
import { Scholarship } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building, DollarSign, Search, Filter, Sparkles, GraduationCap } from 'lucide-react';

export const metadata = {
  title: 'Explore Scholarships | USG India',
  description: 'Browse thousands of scholarships for Indian students with smart filtering and AI matching.',
};

export default async function ScholarshipsPage() {
  let scholarships: Scholarship[] = [];
  try {
     scholarships = await getScholarships();
  } catch (e) {
     console.error("Failed to fetch scholarships", e);
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-purple-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto py-16 px-4 relative z-10">
        <div className="mb-16 max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 border-primary/20 bg-primary/5 text-primary backdrop-blur-md rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Empowering Your Education
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            Find Your <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-purple-500 to-accent">Scholarship</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-10">
            Access billions in student aid through our verified database of central, state, and private scholarships.
          </p>
          
          {/* Search/Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 p-2 bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl">
            <div className="relative grow">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
               <input 
                 type="text" 
                 placeholder="Search by name, provider or category..." 
                 className="w-full bg-transparent border-none focus:ring-0 pl-14 py-4 text-lg font-medium outline-none"
               />
            </div>
            <Button size="lg" className="rounded-2xl h-14 px-8 font-bold bg-primary hover:bg-primary/90">
              <Filter className="mr-2 w-5 h-5" /> Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(scholarships) && scholarships.map((scholarship, i) => (
            <div key={scholarship.id} style={{ animationDelay: `${i * 100}ms` }} className="animate-in fade-in slide-in-from-bottom-5">
              <Card className="flex flex-col h-full bg-card/40 backdrop-blur-md border-border/50 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group">
                <div className="h-1.5 w-full bg-linear-to-r from-primary via-purple-500 to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors font-semibold">
                      {scholarship.provider === 'Central' ? 'Govt Featured' : (scholarship.category || 'General')}
                    </Badge>
                    {scholarship.deadline && (
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center bg-muted/30 px-3 py-1 rounded-full">
                        <Calendar className="w-3 h-3 mr-1.5" />
                        {new Date(scholarship.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-2xl font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {scholarship.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grow space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-md text-muted-foreground font-medium">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center mr-3">
                        <Building className="w-4 h-4 text-primary" />
                      </div>
                      {scholarship.provider || 'USG India Verified'}
                    </div>
                    <div className="flex items-center text-xl font-black text-green-500">
                      <div className="w-8 h-8 rounded-lg bg-green-500/5 flex items-center justify-center mr-3">
                        <DollarSign className="w-4 h-4 text-green-500" />
                      </div>
                      {scholarship.amount || 'Funding Available'}
                    </div>
                  </div>
                  <p className="text-md text-muted-foreground line-clamp-3 leading-relaxed">
                    {scholarship.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button asChild className="w-full h-12 rounded-xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground font-bold transition-all shadow-lg active:scale-95">
                    <Link href={`/scholarships/${scholarship.id}`}>View Opportunity</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
        
        {(!scholarships || !Array.isArray(scholarships) || scholarships.length === 0) && (
          <div className="text-center py-32 bg-card/30 backdrop-blur-xl rounded-4xl border border-dashed border-border/50">
             <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10 text-muted-foreground" />
             </div>
             <h3 className="text-2xl font-bold text-foreground mb-2">Expanding Our Database</h3>
             <p className="text-muted-foreground text-lg max-w-md mx-auto">
               We're currently verifying new scholarship opportunities. Check back in a few hours!
             </p>
             <Button variant="outline" className="mt-8 rounded-full px-8">Get Notified</Button>
          </div>
        )}
      </div>
    </div>
  );
}
