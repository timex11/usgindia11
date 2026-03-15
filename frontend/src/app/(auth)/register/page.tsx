"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Mail, Shield, Zap } from "lucide-react";
// cspell:ignore marsidev
import { Turnstile } from "@marsidev/react-turnstile";
import { motion } from "framer-motion";

const registerSchema = z.object({
  email: z.string().min(1, "Email is required").refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Please enter a valid email address."),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  role: z.enum(["student", "teacher", "alumni", "college"]),
  turnstileToken: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterResponse {
  message?: string;
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      role: "student",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json() as RegisterResponse;

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast.success("Account created successfully! Please log in.");
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05080f] relative overflow-hidden p-4">
       {/* Background Aura */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-130 relative z-10"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 rounded-xl border border-slate-700 p-2 group-hover:scale-110 transition-transform shadow-xl">
              <Image src="/logo.png" alt="USG India" width={40} height={40} className="object-contain" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">USG INDIA</span>
          </Link>
        </div>

        <Card className="bg-slate-900/40 backdrop-blur-2xl border-slate-800/60 shadow-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-linear-to-r from-blue-600 to-indigo-600" />
          <CardHeader className="space-y-2 pb-6 pt-8 text-center">
            <CardTitle className="text-3xl font-black text-white">Join the Network</CardTitle>
            <CardDescription className="text-slate-400 font-medium">
              Create your secure node in the largest student ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-slate-300 font-bold ml-1">Full Legal Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                          <Input 
                            placeholder="John Alexander Doe" 
                            {...field} 
                            disabled={isLoading}
                            className="h-12 bg-slate-950/50 border-slate-800 focus:border-blue-500/50 focus:ring-blue-500/20 pl-11 text-slate-200"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-rose-500 font-medium" />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-slate-300 font-bold ml-1">Primary Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                            <Input 
                              placeholder="m@example.com" 
                              type="email" 
                              {...field} 
                              disabled={isLoading} 
                              className="h-12 bg-slate-950/50 border-slate-800 focus:border-blue-500/50 focus:ring-blue-500/20 pl-11 text-slate-200"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-rose-500 font-medium" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-slate-300 font-bold ml-1">Platform Identity</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-slate-950/50 border-slate-800 focus:border-blue-500/50 focus:ring-blue-500/20 text-slate-200 pl-4">
                              <SelectValue placeholder="Select Identity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                            <SelectItem value="student" className="focus:bg-blue-600 focus:text-white">Student</SelectItem>
                            <SelectItem value="teacher" className="focus:bg-blue-600 focus:text-white">Mentor / Faculty</SelectItem>
                            <SelectItem value="alumni" className="focus:bg-blue-600 focus:text-white">Alumni</SelectItem>
                            <SelectItem value="college" className="focus:bg-blue-600 focus:text-white">Administration</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-rose-500 font-medium" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-slate-300 font-bold ml-1">Universal Key</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            disabled={isLoading} 
                            className="h-12 bg-slate-950/50 border-slate-800 focus:border-blue-500/50 focus:ring-blue-500/20 pl-11 text-slate-200"
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-[10px] text-slate-500 font-bold tracking-wider ml-1">
                        MINIMUM 8 CHARACTERS &bull; AES-256 ENCRYPTED
                      </FormDescription>
                      <FormMessage className="text-rose-500 font-medium" />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center py-2 bg-slate-950/30 rounded-2xl border border-slate-800/50">
                  <Turnstile 
                    siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"} 
                    onSuccess={(token) => form.setValue("turnstileToken", token)}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg rounded-2xl mt-4 transition-all hover:scale-[1.02] shadow-xl shadow-indigo-600/25 active:scale-[0.98]" 
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <Zap className="mr-3 h-5 w-5 fill-current" />}
                  Create Secure Account
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <span className="text-slate-500 font-medium mr-1.5">Already part of the network?</span>
              <Link href="/login" className="text-indigo-500 font-black hover:text-indigo-400 underline underline-offset-4 decoration-2 decoration-indigo-500/30">
                Log In
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <p className="mt-10 text-center text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">
          &copy; {new Date().getFullYear()} USG INDIA &bull; NODE-A1 &bull; PRIVACY PROTOCOL ACTIVE
        </p>
      </motion.div>
    </div>
  );
}
