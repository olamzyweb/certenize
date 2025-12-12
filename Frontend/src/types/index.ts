export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number; // in seconds
  passingScore: number; // percentage
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  answers: number[];
  completedAt: string;
}

export interface Certificate {
  id: string;
  tokenId?: string;
  title: string;
  description: string;
  recipientAddress: string;
  recipientName?: string;
  issueDate: string;
  topic: string;
  score: number;
  imageUrl: string;
  metadataUri?: string;
  transactionHash?: string;
  minted: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GenerateQuizRequest {
  walletAddress: string;
  topic: string;
  pdfContent?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  questionCount?: number;
}

export interface SubmitQuizRequest {
  quizId: string;
  answers: number[];
  walletAddress: string;
  timeTaken: number;
}

export interface MintCredentialRequest {
  walletAddress: string;
  certificateData: {
    title: string;
    topic: string;
    score: number;
    recipientName?: string;
  };
}
