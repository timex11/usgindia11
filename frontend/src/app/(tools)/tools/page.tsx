"use client";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Cpu, 
  FileText, 
  GraduationCap, 
  Maximize, 
  ArrowRight,
  Wand2,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const tools = [
  {
    id: "ai-assistant",
    name: "AI Career Assistant",
    description: "Personalized career guidance and exam preparation help.",
    icon: Cpu,
    link: "/ai/ask",
    color: "text-purple-500",
    bg: "bg-purple-100 dark:bg-purple-900/20",
  },
  {
    id: "resume-builder",
    name: "Resume Builder",
    description: "Create ATS-friendly resumes for top Indian companies.",
    icon: FileText,
    link: "/tools/resume-builder",
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    id: "scholarship-finder",
    name: "Scholarship Finder",
    description: "Find and track government and private scholarships.",
    icon: GraduationCap,
    link: "/tools/scholarship-finder",
    color: "text-green-500",
    bg: "bg-green-100 dark:bg-green-900/20",
  },
  {
    id: "photo-resizer",
    name: "Photo Resizer",
    description: "Perfectly resize photos for JEE, NEET, and CUET.",
    icon: Maximize,
    link: "/tools/photo-resizer",
    color: "text-orange-500",
    bg: "bg-orange-100 dark:bg-orange-900/20",
  },
  {
    id: "job-board",
    name: "Professional Jobs",
    description: "Exclusive job openings from our partner network.",
    icon: Briefcase,
    link: "/jobs",
    color: "text-rose-500",
    bg: "bg-rose-100 dark:bg-rose-900/20",
  },
];

export default function ToolsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          The <span className="text-primary">USG India</span> Toolbox
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Professional-grade tools designed to accelerate your academic and career journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <Link href={tool.link} key={tool.id} className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
              <CardHeader>
                <div className={`w-14 h-14 rounded-2xl ${tool.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <tool.icon className={`h-8 w-8 ${tool.color}`} />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  {tool.name}
                </CardTitle>
                <CardDescription className="text-base">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="p-0 group-hover:translate-x-2 transition-transform">
                  Launch Tool <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
        
        {/* Placeholder for coming soon */}
        <Card className="h-full border-dashed border-2 flex items-center justify-center p-8 bg-muted/20">
          <div className="text-center space-y-2">
            <Wand2 className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="font-semibold">More coming soon</h3>
            <p className="text-sm text-muted-foreground">{"We're building more tools for you."}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
