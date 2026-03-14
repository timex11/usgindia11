import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Empowering Students Across India</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            USG India is dedicated to bridging the gap between education and opportunity.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/register">Join Our Community</Link>
          </Button>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To provide a comprehensive platform where students can access quality educational resources, 
                participate in mock exams, find scholarships, and connect with career opportunities. 
                We believe that every student deserves a fair shot at success, regardless of their background.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To become {"India's"} leading digital ecosystem for student empowerment,
                fostering a culture of excellence, innovation, and inclusivity in the educational landscape.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Skill Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                Advanced mock exams and assessments designed to test your knowledge and prepare you for real-world challenges.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Career Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                Expert insights, job listings, and internship opportunities tailored to your skills and aspirations.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Resource Library</CardTitle>
              </CardHeader>
              <CardContent>
                A curated collection of study materials, guides, and tools to support your educational journey.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
          <p className="text-xl mb-8 opacity-90">
            Have questions or want to collaborate? {"We'd"} love to hear from you.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" asChild>
              <a href="mailto:contact@usgindia.org">Email Us</a>
            </Button>
            <Button variant="outline" className="bg-transparent border-white hover:bg-white hover:text-primary" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} USG India. All rights reserved.</p>
      </footer>
    </div>
  );
}
