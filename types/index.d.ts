interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
  analytics?: PerformanceAnalytics;
  comparison?: {
    previousScore: number;
    improvement: number;
    trend: 'up' | 'down' | 'stable';
  };
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
  recording?: InterviewRecording;
  codeEvaluation?: CodeEvaluation;
  preparation?: InterviewPreparation;
  schedule?: InterviewSchedule;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

interface User {
  name: string;
  email: string;
  id: string;
}

interface InterviewCardProps {
  id?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}

interface InterviewType {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'behavioral' | 'system-design' | 'coding-challenge';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  topics: string[];
}

interface InterviewTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  questions: string[];
  difficulty: string;
  techstack: string[];
  createdAt: string;
  createdBy: string;
}

interface InterviewRecording {
  id: string;
  interviewId: string;
  userId: string;
  audioUrl: string;
  transcript: string;
  duration: number;
  createdAt: string;
}

interface PerformanceAnalytics {
  userId: string;
  totalInterviews: number;
  averageScore: number;
  categoryAverages: {
    [key: string]: number;
  };
  improvementAreas: string[];
  strengths: string[];
  progress: {
    date: string;
    score: number;
  }[];
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  bio?: string;
  skills: string[];
  experience: string;
  education: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  interviewHistory: string[];
  referralCode: string;
  referredBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface InterviewSchedule {
  id: string;
  userId: string;
  interviewType: string;
  scheduledAt: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  interviewerId?: string;
  notes?: string;
}

interface CodeEvaluation {
  id: string;
  interviewId: string;
  userId: string;
  code: string;
  language: string;
  testResults: {
    passed: boolean;
    message: string;
    executionTime: number;
  }[];
  score: number;
  feedback: string;
  createdAt: string;
}

interface InterviewPreparation {
  id: string;
  title: string;
  content: string;
  type: string;
  difficulty: string;
  resources: {
    title: string;
    url: string;
    type: 'video' | 'article' | 'practice';
  }[];
  createdAt: string;
  updatedAt: string;
}
