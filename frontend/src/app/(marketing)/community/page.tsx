import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Share2, Heart } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Community & Forums | USG India',
  description: 'Join the most vibrant community of Indian students, aspirants, and professionals.',
};

export default function CommunityLandingPage() {
  return (
    <div className="container mx-auto py-16 px-4 max-w-7xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Vibrant Student Community</h1>
        <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
          Connect, discuss, and grow together with millions of students and experts.
        </p>
        <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" className="rounded-full px-8">Join the Discussion</Button>
            <Button size="lg" variant="outline" className="rounded-full px-8">Browse Forums</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <Card className="text-center p-6 border-2 hover:border-primary transition-all">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircle className="text-primary w-6 h-6" />
            </div>
            <CardTitle>Forums</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Expert-led discussions on every academic topic imagineable.</p>
          </CardContent>
        </Card>

        <Card className="text-center p-6 border-2 hover:border-primary transition-all">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Share2 className="text-blue-600 w-6 h-6" />
            </div>
            <CardTitle>Study Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Collaborate with peers preparing for the same goals.</p>
          </CardContent>
        </Card>

        <Card className="text-center p-6 border-2 hover:border-primary transition-all">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Heart className="text-red-600 w-6 h-6" />
            </div>
            <CardTitle>Peer Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">A safe space for mentorship and mental well-being.</p>
          </CardContent>
        </Card>
      </div>

      <section className="bg-secondary/20 rounded-3xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to be part of the future?</h2>
        <p className="mb-8 text-lg text-muted-foreground">Registration is free and open to all students and educators.</p>
        <Link href="/join">
            <Button size="lg" className="rounded-full px-12 h-14 text-lg">Create Free Account</Button>
        </Link>
      </section>
    </div>
  );
}
