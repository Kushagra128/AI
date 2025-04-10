export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface Interview {
  id: string;
  userId: string;
  type: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  duration: number;
  score?: number;
  feedback?: string;
  recordingUrl?: string;
  transcript?: string;
  codeEvaluation?: {
    score: number;
    feedback: string;
    testResults: Array<{
      name: string;
      passed: boolean;
      message?: string;
    }>;
  };
} 