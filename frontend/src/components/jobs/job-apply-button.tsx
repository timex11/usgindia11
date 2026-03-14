"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { JobApplicationForm } from "./job-application-form";
import { ArrowUpRight } from "lucide-react";

interface JobApplyButtonProps {
  jobId: string;
}

export function JobApplyButton({ jobId }: JobApplyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 shadow-md">
          Apply Now <ArrowUpRight className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Job Application</DialogTitle>
          <DialogDescription>
            Submit your application for this position. Please provide your resume link below.
          </DialogDescription>
        </DialogHeader>
        <JobApplicationForm 
          jobId={jobId} 
          onSuccess={() => setIsOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
