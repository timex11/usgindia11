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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2, Mail, Lock, Sparkles } from "lucide-react";
// cspell:ignore marsidev
import { Turnstile } from "@marsidev/react-turnstile";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Please enter a valid email address."),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  turnstileToken: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    role: string;
  };
  message?: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json() as LoginResponse;

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setAuth(data.user, data.access_token);
      
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05080f] relative overflow-hidden p-4">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-110 relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="group flex flex-col items-center gap-4">
            <div className="relative w-20 h-20 bg-slate-900 rounded-3xl p-1 border border-slate-700 shadow-2xl transition-transform group-hover:scale-110">
               <Image src="/logo.png" alt="USG India" fill className="p-4 object-contain" priority />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-black tracking-tighter text-white">USG <span className="text-blue-500">INDIA</span></h1>
              <p className="text-xs font-bold text-slate-500 tracking-[0.3em] uppercase mt-1">Enterprise Portal</p>
            </div>
          </Link>
        </div>

        <Card className="bg-slate-900/40 backdrop-blur-2xl border-slate-800/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="h-1.5 w-full bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600" />
          <CardHeader className="space-y-2 pb-6 pt-8">
            <CardTitle className="text-3xl font-black text-white text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center text-slate-400 font-medium">
              Access your personalized academic control center
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-slate-300 font-bold ml-1">Work Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                          <Input 
                            placeholder="name@university.edu" 
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
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <div className="flex justify-between items-center ml-1">
                        <FormLabel className="text-slate-300 font-bold">Security Key</FormLabel>
                        <Link href="/forgot-password" className="text-xs font-bold text-blue-500 hover:text-blue-400">
                          Reset?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
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

                <div className="flex justify-center py-2 bg-slate-950/30 rounded-2xl border border-slate-800/50">
                  <Turnstile 
                    siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"} 
                    onSuccess={(token) => form.setValue("turnstileToken", token)}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl transition-all hover:scale-[1.02] shadow-xl shadow-blue-600/25 active:scale-[0.98]" 
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <Sparkles className="mr-3 h-5 w-5" />}
                  Identify & Sign In
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <span className="text-slate-500 font-medium mr-1.5">New to the ecosystem?</span>
              <Link href="/register" className="text-blue-500 font-black hover:text-blue-400 underline underline-offset-4 decoration-2 decoration-blue-500/30">
                Join the Network
              </Link>
            </div>
          </CardContent>
        </Card>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]"
        >
          &copy; {new Date().getFullYear()} USG INDIA &bull; SECURE NODE-A1 &bull; ALL RIGHTS RESERVED
        </motion.p>
      </motion.div>
    </div>
  );
}
