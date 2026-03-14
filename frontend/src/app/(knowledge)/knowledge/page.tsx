import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Book, Search, Star, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const metadata = {
  title: 'Knowledge Base | USG India',
  description: 'The Wikipedia of Indian Education. Peer-reviewed, cited, and versioned articles.',
};

export default function KnowledgePage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Knowledge Base</h1>
          <p className="text-xl text-muted-foreground">
            Explore the encyclopedia of Indian education, careers, and systems.
          </p>
        </div>
        <div className="w-full md:w-96 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search knowledge..." className="pl-10 h-12 rounded-full border-2 border-primary/20 focus:border-primary transition-all" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
            <section>
                <div className="flex items-center gap-2 mb-6 pb-2 border-b">
                    <Star className="text-yellow-500 w-5 h-5" />
                    <h2 className="text-2xl font-bold">Featured Articles</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="hover:border-primary transition-all cursor-pointer group">
                            <CardHeader>
                                <CardTitle className="text-lg group-hover:text-primary transition-colors">Understanding the NEP 2020</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    A comprehensive guide to the National Education Policy 2020 and its impact on higher education in India.
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-6 pb-2 border-b">
                    <Clock className="text-blue-500 w-5 h-5" />
                    <h2 className="text-2xl font-bold">Recent Changes</h2>
                </div>
                <div className="space-y-4">
                     {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-secondary/10 border border-border/50">
                            <Book className="w-5 h-5 mt-1 text-muted-foreground" />
                            <div>
                                <h4 className="font-semibold text-sm">IIT Admissions Process updated</h4>
                                <p className="text-xs text-muted-foreground">Edited by USG Editor • 2 hours ago</p>
                            </div>
                        </div>
                     ))}
                </div>
            </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
             <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-lg">Contribute</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm">Help us build the most accurate knowledge base for Indian students.</p>
                    <Button variant="outline" className="w-full">Become a Contributor</Button>
                </CardContent>
             </Card>

             <div className="space-y-4">
                <h3 className="font-bold text-lg px-2">Categories</h3>
                <nav className="flex flex-col gap-1">
                    {['Academic Policies', 'Career Paths', 'University Systems', 'Competitive Exams'].map((cat) => (
                        <Link key={cat} href="#" className="px-4 py-2 text-sm rounded-md hover:bg-secondary transition-colors">
                            {cat}
                        </Link>
                    ))}
                </nav>
             </div>
        </aside>
      </div>
    </div>
  );
}
import { Button } from '@/components/ui/button';
