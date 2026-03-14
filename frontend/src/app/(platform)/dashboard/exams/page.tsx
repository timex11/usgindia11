"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { ExamCard } from "@/components/exams/exam-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

interface Exam {
  id: string;
  title: string;
  category?: "Government" | "Technical" | "Entrance";
  durationMinutes: number;
  totalMarks?: number;
  createdAt?: string;
  status?: "Completed" | "Pending" | "Active";
}

export default function ExamsPage() {
  const { get, loading } = useApi();
  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await get<Exam[]>("/exams");
        setExams(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch exams:', error);
      }
    };
    fetchExams();
  }, [get]);

  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || exam.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exam Portal</h1>
          <p className="text-muted-foreground">Access your examinations, certifications, and entrance tests.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search exams..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Government">Government</SelectItem>
            <SelectItem value="Technical">Technical</SelectItem>
            <SelectItem value="Entrance">Entrance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
          ))}
        </div>
      ) : filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <ExamCard 
              key={exam.id} 
              id={exam.id}
              title={exam.title}
              category={exam.category || "General"}
              duration={exam.durationMinutes}
              totalQuestions={0} // Backend doesn't return this yet in findAll
              startDate={exam.createdAt}
              status={exam.status || "Active"}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No exams found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
