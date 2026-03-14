import { getScholarships } from '@/lib/api-client';
import { LandingPageClient } from '@/components/landing-page-client';
import { Scholarship } from '@/types';

export const metadata = {
  title: 'USG India - Shape Your Future',
  description: 'India\'s #1 Student Empowerment Platform for scholarships, resources, and community.',
};

// Mock stats fetcher (or could be real if endpoints exist)
async function getStats() {
    // In a real scenario, fetch this from API
    // const res = await fetch(...)
    return {
        students: 52430,
        universities: 128,
        scholarshipsValue: '₹2.4Cr+',
        resources: 560
    };
}

export default async function Home() {
  // Fetch data in parallel
  // We use a try-catch pattern implicitly by handling the promise results
  let scholarships: Scholarship[] = [];
  let stats = {
      students: 50000,
      universities: 120,
      scholarshipsValue: '₹2Cr+',
      resources: 500
  };

  try {
      const results = await Promise.allSettled([
          getScholarships({ limit: '3' }),
          getStats()
      ]);

      if (results[0].status === 'fulfilled') {
          scholarships = (results[0].value as Scholarship[]) || [];
      }
      
      if (results[1].status === 'fulfilled') {
          stats = results[1].value;
      }
  } catch (e) {
      console.error("Error fetching landing page data", e);
  }

  return <LandingPageClient scholarships={scholarships} stats={stats} />;
}
