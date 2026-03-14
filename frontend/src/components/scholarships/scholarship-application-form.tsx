"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";

interface ScholarshipApplicationFormProps {
  scholarshipId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ScholarshipApplicationForm({ 
  scholarshipId, 
  onSuccess,
  onCancel 
}: ScholarshipApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { post } = useApi();

  async function onApply() {
    setIsSubmitting(true);
    try {
      await post(`/scholarships/${scholarshipId}/apply`, {});
      toast.success("Application submitted successfully!");
      onSuccess();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        <p>
          By clicking {"\"Confirm Application\""}, your profile details will be shared with the scholarship provider for review.
          Please ensure your profile is up to date.
        </p>
      </div>
      
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={onApply} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm Application
        </Button>
      </div>
    </div>
  );
}
