import { getScholarships } from '@/lib/api-client';
import { Scholarship } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building, DollarSign } from 'lucide-react';

export const metadata = {
  title: 'Find Scholarships | USG India',
  description: 'Browse thousands of scholarships for Indian students. State, Central, and Private opportunities.',
};

export default async function ScholarshipsPage() {
  let scholarships: Scholarship[] = [];
  try {
     scholarships = await getScholarships();
  } catch (e) {
     console.error("Failed to fetch scholarships", e);
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Scholarship Opportunities</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover financial aid options tailored for your academic journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(scholarships) && scholarships.map((scholarship) => (
          <Card key={scholarship.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant={scholarship.provider === 'Central' ? 'default' : 'secondary'}>
                  {scholarship.provider || 'General'}
                </Badge>
                {scholarship.deadline && (
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(scholarship.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
              <CardTitle className="line-clamp-2 min-h-[3.5rem]">{scholarship.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div className="flex items-center text-sm text-slate-600">
                <Building className="w-4 h-4 mr-2" />
                {scholarship.provider || 'USG India'}
              </div>
              <div className="flex items-center text-sm font-semibold text-green-600">
                <DollarSign className="w-4 h-4 mr-2" />
                {scholarship.amount || 'Variable Amount'}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {scholarship.description}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/scholarships/${scholarship.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {(!scholarships || !Array.isArray(scholarships) || scholarships.length === 0) && (
        <div className="text-center py-20 bg-slate-50 rounded-xl">
           <h3 className="text-lg font-medium text-slate-900">No scholarships found currently</h3>
           <p className="text-slate-500">Check back later or register to get notified.</p>
        </div>
      )}
    </div>
  );
}
