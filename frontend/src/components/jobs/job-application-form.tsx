"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";

const formSchema = z.object({
  resumeUrl: z.string().url("Please provide a valid URL for your resume (e.g., Google Drive, Dropbox, or upload to our system)."),
});

interface JobApplicationFormProps {
  jobId: string;
  onSuccess: () => void;
}

export function JobApplicationForm({ jobId, onSuccess }: JobApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { post } = useApi();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await post(`/jobs/${jobId}/apply`, values);
      toast.success("Application submitted successfully!");
      onSuccess();
    } catch (error) {
      // Error handling is managed by axios interceptor in useApi/axiosInstance usually,
      // but we can catch specific cases here if needed.
      // toast.error is already called in axios interceptor?
      // Checking axios.ts: Yes, it is. But let's keep a generic fallback if needed or just let it bubble.
      // The catch block here prevents the app from crashing.
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="resumeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume URL</FormLabel>
              <FormControl>
                <Input placeholder="https://drive.google.com/..." {...field} />
              </FormControl>
              <FormDescription>
                {"Provide a link to your resume. We'll support direct uploads soon!"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Application
        </Button>
      </form>
    </Form>
  );
}
