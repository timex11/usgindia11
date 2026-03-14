import { getScholarship } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Calendar, Building, DollarSign } from 'lucide-react';
import { ScholarshipApplyButton } from '@/components/scholarships/scholarship-apply-button';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
     const { id } = await params;
     const data = await getScholarship(id);
     return { title: `${data?.title} - USG India`, description: data?.description?.substring(0, 160) };
  } catch {
     return { title: 'Scholarship Details' };
  }
}

export default async function ScholarshipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let scholarship;
  try {
    scholarship = await getScholarship(id);
  } catch {
    return (
        <div className="container mx-auto py-20 text-center">
            <h1 className="text-2xl font-bold text-red-500">Scholarship not found</h1>
            <Button asChild className="mt-4"><Link href="/scholarships">Back to List</Link></Button>
        </div>
    );
  }

  if (!scholarship) {
      return (
        <div className="container mx-auto py-20 text-center">
            <h1 className="text-2xl font-bold text-red-500">Scholarship not found</h1>
            <Button asChild className="mt-4"><Link href="/scholarships">Back to List</Link></Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Button asChild variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-blue-600">
        <Link href="/scholarships"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Scholarships</Link>
      </Button>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white p-8">
            <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{scholarship.provider || 'Scholarship'}</span>
                {scholarship.deadline && <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs flex items-center"><Calendar className="w-3 h-3 mr-1.5"/> Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{scholarship.title}</h1>
            <div className="flex items-center text-slate-300">
                <Building className="w-4 h-4 mr-2" /> {scholarship.provider || 'USG India'}
            </div>
        </div>
        
        <div className="p-8 space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-3 border-b pb-2">Description</h3>
                        <div className="prose text-slate-600 leading-relaxed whitespace-pre-line">{scholarship.description}</div>
                    </section>
                    
                    {JSON.stringify(scholarship.eligibilityCriteria || {}) && (
                         <section>
                            <h3 className="text-lg font-bold text-slate-900 mb-3 border-b pb-2">Eligibility</h3>
                            <div className="prose text-slate-600 leading-relaxed whitespace-pre-line">{JSON.stringify(scholarship.eligibilityCriteria || {})}</div>
                        </section>
                    )}
                </div>
                
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                        <h4 className="text-sm uppercase tracking-wider text-green-800 font-bold mb-2">Award Amount</h4>
                        <div className="text-3xl font-bold text-green-700 flex items-center">
                            <DollarSign className="w-6 h-6 mr-1" /> {scholarship.amount || 'N/A'}
                        </div>
                    </div>
                    
                    <ScholarshipApplyButton scholarshipId={scholarship.id} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
