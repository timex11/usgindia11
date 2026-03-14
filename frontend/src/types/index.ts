export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: string;
  studentId?: string;
  universityId?: string;
  collegeId?: string;
  phoneNumber?: string;
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
  aadhaarNumber?: string;
  user_metadata?: Record<string, unknown>;
}

export interface Scholarship {
  id: string;
  title: string;
  description: string | null;
  category?: string;
  amount: number | string | null;
  deadline: string | null;
  eligibilityCriteria?: unknown; // Json
  provider: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string | null;
  type: 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'FREELANCE';
  description: string | null;
  salaryRange: string | null;
  createdAt: string;
}

export interface DashboardData {
  stats: {
    totalApplications: number;
    activeExams: number;
    completedExams: number;
    averageScore: number;
  };
  activity: {
    id: string;
    type: string;
    title: string;
    status: string;
    date: string;
  }[];
  notifications: Notification[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ALERT';
  createdAt: string;
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  content: string;
  senderId: string;
  createdAt: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO';
  sender: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
}

export interface Exam {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  type: 'ENTRANCE' | 'SEMESTER' | 'COMPETITIVE' | 'CERTIFICATION' | 'MOCK';
  durationMinutes: number;
  totalMarks: number;
  isActive: boolean;
  createdAt: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  score: number | null;
  startedAt: string;
  submittedAt: string | null;
  exam?: Exam;
}
