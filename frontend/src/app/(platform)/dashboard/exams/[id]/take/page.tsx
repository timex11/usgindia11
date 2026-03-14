"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Timer, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  Send,
  Loader2,
  ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useSocket } from "@/hooks/useSocket";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

interface Exam {
  id: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
}

export default function TakeExamPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const { emit } = useSocket();
  const [exam, setExam] = useState<Exam | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExam = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json() as Exam;
        setExam(data);
        setTimeLeft(data.durationMinutes * 60);

        // Create attempt
        const attemptRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams/${params.id}/start`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (attemptRes.ok) {
          const attemptData = await attemptRes.json() as { id: string };
          setAttemptId(attemptData.id);
        }
      }
    } catch {
      toast.error("Failed to load exam");
    } finally {
      setIsLoading(false);
    }
  }, [params.id, token]);

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    if (attemptId) {
        void emit('exam_event', { attemptId, eventType: 'answer_selected', details: { questionId, optionId } });
    }
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams/attempts/${attemptId}/submit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ answers })
      });
      if (res.ok) {
        toast.success("Exam submitted successfully!");
        router.push("/dashboard");
      }
    } catch {
      toast.error("Failed to submit exam");
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  if (!exam) return <div>Exam not found</div>;

  const currentQuestion = exam.questions[currentQuestionIndex];
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{exam.title}</h1>
            <div className="flex items-center gap-2 text-slate-500 mt-1">
              <ShieldAlert className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Proctoring Active</span>
            </div>
          </div>
          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border-2 ${timeLeft < 300 ? 'border-red-200 bg-red-50 text-red-600' : 'border-blue-100 bg-blue-50 text-blue-600'}`}>
            <Timer className="w-5 h-5" />
            <span className="text-xl font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-3">
            <Card className="border-none shadow-lg">
              <CardHeader className="border-b bg-slate-50/50">
                <div className="flex justify-between items-center">
                  <div className="rounded-full border border-slate-200 px-3 py-1 text-xs bg-white">Question {currentQuestionIndex + 1} of {exam.questions.length}</div>
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-8 leading-relaxed">
                  {currentQuestion.text}
                </h3>

                <RadioGroup 
                  value={answers[currentQuestion.id] || ""} 
                  onValueChange={(val) => handleAnswer(currentQuestion.id, val)}
                  className="space-y-4"
                >
                  {currentQuestion.options.map((option) => (
                    <div key={option.id} className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${answers[currentQuestion.id] === option.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}>
                      <RadioGroupItem value={option.id} id={option.id} className="text-blue-600" />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer font-medium text-slate-700">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-between items-center mt-12 pt-8 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  
                  {currentQuestionIndex === exam.questions.length - 1 ? (
                    <Button className="bg-green-600 hover:bg-green-700 px-8" onClick={handleSubmit}>
                      Submit Exam <Send className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button className="bg-blue-600 hover:bg-blue-700 px-8" onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {exam.questions.map((q, i) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(i)}
                      aria-label={`Go to question ${i + 1}`}
                      className={`h-10 w-10 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${
                        currentQuestionIndex === i
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-600 ring-offset-2'
                          : answers[q.id]
                            ? 'bg-blue-100 text-blue-600 border border-blue-200'
                            : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                <div className="flex gap-2 text-orange-800 font-bold text-sm mb-2">
                    <AlertTriangle className="w-4 h-4" /> Warning
                </div>
                <p className="text-xs text-orange-700 leading-relaxed">
                    Exiting full screen or switching tabs will be logged as a proctoring violation.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
