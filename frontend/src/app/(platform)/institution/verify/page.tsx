"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Building2, 
  CheckCircle, 
  ShieldCheck, 
  Upload, 
  FileCheck,
  Search,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { Badge } from "@/components/ui/badge";

interface VerificationStatus {
  id: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  institutionName: string;
}

export default function InstitutionVerifyPage() {
  const [institutionName, setInstitutionName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationStatus | null>(null);
  const { token } = useAuthStore();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName) return;

    setIsVerifying(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/institutions/verify-search`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name: institutionName })
      });

      if (res.ok) {
        const data = await res.json() as VerificationStatus;
        setResult(data);
        toast.success("Verification check complete");
      } else {
        toast.error("Institution not found in our directory");
        setResult(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during verification");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3">Institutional Verification</h1>
        <p className="text-muted-foreground">Verify your college or university affiliation to unlock premium features.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="border-blue-100 bg-blue-50/30">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
              <Search className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg">Quick Search</CardTitle>
            <CardDescription>Check if your institution is already verified in our network.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inst-name">Institution Name</Label>
                <Input 
                  id="inst-name" 
                  placeholder="e.g. University of Delhi" 
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isVerifying}>
                {isVerifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                Verify Affiliation
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-indigo-100 bg-indigo-50/30">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg">Upload Proof</CardTitle>
            <CardDescription>Upload your student ID card or admission receipt for manual verification.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full h-24 border-dashed border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 flex flex-col gap-2">
              <FileCheck className="w-6 h-6 text-indigo-400" />
              <span>Click to upload documents</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {result && (
        <Card className="border-green-100 bg-green-50/20 overflow-hidden">
          <div className="bg-green-600 h-1" />
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{result.institutionName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-green-600">{result.status.toUpperCase()}</Badge>
                  <span className="text-xs text-slate-500">Verified on {new Date(result.submittedAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                  Your affiliation with this institution has been successfully verified. You now have access to university-specific resources, forum channels, and exclusive scholarships.
                </p>
                <Button className="mt-6 bg-slate-900 hover:bg-slate-800">
                  Explore University Portal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" /> Why verify?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <h4 className="font-bold text-sm mb-2">Resource Access</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Unlock notes, guess papers, and study guides specifically for your course and university.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <h4 className="font-bold text-sm mb-2">Priority Jobs</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Get first-hand access to internships and placements posted by your alumni and partner companies.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <h4 className="font-bold text-sm mb-2">Verified Profile</h4>
            <p className="text-xs text-slate-500 leading-relaxed">A verified badge on your profile increases your credibility in the student community.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
