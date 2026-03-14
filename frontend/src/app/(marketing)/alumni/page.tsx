import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Briefcase, Award, Globe } from 'lucide-react';

export const metadata = {
  title: 'Alumni Network | USG India',
  description: 'Connect with successful alumni from top institutions and build your professional network.',
};

export default function AlumniLandingPage() {
  return (
    <div className="container mx-auto py-16 px-4 max-w-7xl">
      <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
        <div className="flex-1 space-y-8">
            <h1 className="text-5xl font-extrabold leading-tight">Legacy of Success</h1>
            <p className="text-xl text-muted-foreground">
                Join the USG Alumni Network to unlock professional opportunities, mentorship, and a lifelong connection with your peers.
            </p>
            <div className="flex gap-4">
                <Button size="lg" className="rounded-full">Join the Network</Button>
                <Button size="lg" variant="outline" className="rounded-full">View Directory</Button>
            </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="p-8 rounded-3xl bg-primary/10 flex flex-col justify-end h-64">
                <span className="text-3xl font-bold">150k+</span>
                <span className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Members</span>
            </div>
             <div className="p-8 rounded-3xl bg-blue-100 flex flex-col justify-end h-64">
                <span className="text-3xl font-bold">500+</span>
                <span className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Chapters</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Card className="border-0 shadow-none text-center group">
            <CardHeader>
                <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Briefcase />
                </div>
                <CardTitle className="text-lg">Career Services</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Exclusive job boards and career coaching for our alumni.</p>
            </CardContent>
        </Card>

        <Card className="border-0 shadow-none text-center group">
            <CardHeader>
                <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <GraduationCap />
                </div>
                <CardTitle className="text-lg">Mentorship</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Guide the next generation of students from your alma mater.</p>
            </CardContent>
        </Card>

        <Card className="border-0 shadow-none text-center group">
            <CardHeader>
                <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Award />
                </div>
                <CardTitle className="text-lg">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Showcase your professional milestones to the world.</p>
            </CardContent>
        </Card>

        <Card className="border-0 shadow-none text-center group">
            <CardHeader>
                <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Globe />
                </div>
                <CardTitle className="text-lg">Global Reach</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Connect with alumni across every continent and industry.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
