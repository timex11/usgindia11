"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScholarshipApplicationForm } from "./scholarship-application-form";
import { ExternalLink } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

interface ScholarshipApplyButtonProps {
  scholarshipId: string;
}

export function ScholarshipApplyButton({ scholarshipId }: ScholarshipApplyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useAuthStore();

  if (!token) {
    return (
      <div className="space-y-3">
        <Button asChild size="lg" className="w-full text-lg h-14 bg-blue-600 hover:bg-blue-700">
          <Link href={`/login?redirect=/scholarships/${scholarshipId}`}>
            Apply Now <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </Button>
        <p className="text-xs text-center text-slate-500">Login required to apply</p>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full text-lg h-14 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
          Apply Now <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scholarship Application</DialogTitle>
          <DialogDescription>
            You are about to apply for this scholarship. Your profile information will be shared with the provider.
          </DialogDescription>
        </DialogHeader>
        <ScholarshipApplicationForm 
          scholarshipId={scholarshipId} 
          onSuccess={() => setIsOpen(false)} 
          onCancel={() => setIsOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
