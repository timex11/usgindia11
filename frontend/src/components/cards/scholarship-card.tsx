import React from 'react';
import { Calendar, IndianRupee, Tag, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Scholarship {
  id: string;
  title: string;
  description: string | null;
  amount: string | null;
  deadline: string | Date | null;
  category: string | null;
  link: string | null;
  eligibility?: string | null;
}

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship }) => {
  const formatDate = (date: string | Date | null) => {
    if (!date) return 'No deadline';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="group flex flex-col rounded-2xl border bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 h-full overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="p-6 flex flex-col h-full">
        <div className="mb-4 flex items-start justify-between">
            <span className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase",
              scholarship.category === 'Merit Based' ? "bg-purple-100 text-purple-700" :
              scholarship.category === 'Government' ? "bg-emerald-100 text-emerald-700" :
              "bg-blue-100 text-blue-700"
            )}>
              {scholarship.category || 'Scholarship'}
            </span>
        </div>
        
        <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {scholarship.title}
        </h3>
        
        <p className="mb-6 text-sm leading-relaxed text-gray-600 line-clamp-3 flex-grow">
          {scholarship.description || 'No description available'}
        </p>

        <div className="mt-auto space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <IndianRupee className="mr-2 h-4 w-4 text-green-600" />
            <span className="font-medium">{scholarship.amount || 'Amount Varies'}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="mr-2 h-4 w-4 text-orange-500" />
            <span>Deadline: {formatDate(scholarship.deadline)}</span>
          </div>

          {scholarship.eligibility && (
            <div className="flex items-center text-sm text-gray-600">
               <Tag className="mr-2 h-4 w-4 text-purple-500" />
               <span className="truncate">{scholarship.eligibility}</span>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
            <a
              href={scholarship.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-700 active:scale-[0.98]"
            >
                Apply Now
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </a>
        </div>
      </div>
    </div>
  );
};
