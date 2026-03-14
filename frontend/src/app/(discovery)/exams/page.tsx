import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'All Exams, Results & Admit Cards | USG India',
  description: 'Latest exam notifications, admit cards, syllabus, and results.',
};

export default function ExamsLandingPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Exam Portal</h1>
        <p className="text-xl text-muted-foreground">
          Your one-stop destination for all competitive and academic exams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Results Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-green-500">
            <CheckCircle className="text-green-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">Results</h2>
          </div>
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Link key={i} href={`/exams/result-${i}`} className="text-sm hover:underline hover:text-green-600 transition-colors bg-secondary/20 p-2 rounded-md border border-border/50">
                UPSC Civil Services Final Result 2024 Declared
              </Link>
            ))}
          </div>
        </section>

        {/* Admit Cards Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-blue-500">
            <FileText className="text-blue-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">Admit Cards</h2>
          </div>
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Link key={i} href={`/exams/exam-${i}`} className="text-sm hover:underline hover:text-blue-600 transition-colors bg-secondary/20 p-2 rounded-md border border-border/50">
                JEE Main 2025 Session 2 Admit Card
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Jobs/Upcoming Exams Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-red-500">
            <Calendar className="text-red-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">Latest Notifications</h2>
          </div>
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Link key={i} href={`/exams/exam-${i}`} className="text-sm hover:underline hover:text-red-600 transition-colors bg-secondary/20 p-2 rounded-md border border-border/50 flex justify-between items-center">
                <span>SSC CGL 2025 Notification</span>
                <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">NEW</Badge>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-16 text-center">
         <Link href="/exams/all" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
            View All Exams Directory
         </Link>
      </div>
    </div>
  );
}
