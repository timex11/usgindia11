'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">How can we help you?</h1>
        <p className="text-xl text-muted-foreground">
          Our team is here to assist you with any questions or issues.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Email Support</CardTitle>
            <CardDescription>Get a response within 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">support@usgindia.com</p>
          </CardContent>
        </Card>
        
        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>Live Chat</CardTitle>
            <CardDescription>Available 9 AM - 6 PM IST</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm">Start Chat</Button>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
             <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle>Phone Support</CardTitle>
            <CardDescription>For urgent institutional queries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">+91 1800-USG-HELP</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send us a message</CardTitle>
          <CardDescription>Fill out the form below and we&apos;ll get back to you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Message sent successfully!"); }}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What is this regarding?" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                 <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>General Inquiry</option>
                    <option>Technical Issue</option>
                    <option>Billing / Account</option>
                    <option>Feature Request</option>
                 </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                className="min-h-[120px]"
                id="message"
                placeholder="Describe your issue in detail..."
                required
              />
            </div>
             <Button type="submit" className="w-full md:w-auto">Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
