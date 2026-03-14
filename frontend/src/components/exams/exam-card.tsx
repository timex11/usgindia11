"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";

interface ExamCardProps {
  id: string;
  title: string;
  category: string;
  duration: number; // in minutes
  totalQuestions: number;
  startDate?: string;
  status: "Completed" | "Pending" | "Active";
}

export function ExamCard({ id, title, category, duration, totalQuestions, startDate, status }: ExamCardProps) {
  const statusColors = {
    Completed: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Active: "bg-blue-100 text-blue-800",
  };

  const categoryColors: Record<string, string> = {
    Government: "bg-purple-100 text-purple-800",
    Technical: "bg-blue-100 text-blue-800",
    Entrance: "bg-orange-100 text-orange-800",
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge className={categoryColors[category] || "bg-gray-100 text-gray-800"}>{category}</Badge>
          <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{duration} Minutes</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            <span>{totalQuestions} Questions</span>
          </div>
          {startDate && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(startDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/exams/${id}/take`} className="w-full">
          <Button className="w-full" disabled={status === "Completed"}>
            {status === "Completed" ? "View Result" : "Start Exam"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
