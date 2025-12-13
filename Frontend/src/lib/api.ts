import type { 
  Quiz, 
  QuizResult, 
  Certificate, 
  ApiResponse,
  GenerateQuizRequest,
  SubmitQuizRequest,
  MintCredentialRequest
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.certenize.olamzyweb.com.ng/api';

// Fallback quiz data when API is unavailable
const fallbackQuiz: Quiz = {
  id: 'fallback-quiz-1',
  title: 'Blockchain Fundamentals',
  topic: 'Blockchain',
  description: 'Test your knowledge of blockchain technology basics',
  timeLimit: 600, // 10 minutes
  passingScore: 80,
  questions: [
    {
      id: 'q1',
      question: 'What is the primary purpose of blockchain technology?',
      options: [
        'To create digital currencies only',
        'To provide a decentralized, immutable ledger',
        'To replace traditional databases',
        'To enable faster internet connections'
      ],
      correctAnswer: 1
    },
    {
      id: 'q2',
      question: 'What is a "block" in blockchain?',
      options: [
        'A type of cryptocurrency',
        'A collection of transactions bundled together',
        'A mining hardware device',
        'A wallet address'
      ],
      correctAnswer: 1
    },
    {
      id: 'q3',
      question: 'What consensus mechanism does Ethereum currently use?',
      options: [
        'Proof of Work (PoW)',
        'Proof of Stake (PoS)',
        'Delegated Proof of Stake (DPoS)',
        'Proof of Authority (PoA)'
      ],
      correctAnswer: 1
    },
    {
      id: 'q4',
      question: 'What is a Soulbound Token (SBT)?',
      options: [
        'A token that can be freely traded',
        'A non-transferable NFT bound to an identity',
        'A type of stablecoin',
        'A governance token'
      ],
      correctAnswer: 1
    },
    {
      id: 'q5',
      question: 'What is the purpose of gas fees in Ethereum?',
      options: [
        'To pay miners/validators for processing transactions',
        'To buy Ethereum tokens',
        'To create new blocks',
        'To store data on IPFS'
      ],
      correctAnswer: 0
    }
  ]
};

// Fallback certificates data
const fallbackCertificates: Certificate[] = [
  {
    id: 'cert-1',
    tokenId: '1',
    title: 'Blockchain Fundamentals Certificate',
    description: 'Successfully completed the Blockchain Fundamentals course with distinction',
    recipientAddress: '0x0000000000000000000000000000000000000000',
    issueDate: new Date().toISOString(),
    topic: 'Blockchain',
    score: 95,
    imageUrl: '/placeholder.svg',
    minted: true
  }
];

async function fetchWithFallback<T>(
  url: string,
  options: RequestInit,
  fallbackData: T
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.warn('API unavailable, using fallback data:', error);
    return { success: true, data: fallbackData };
  }
}

export async function generateQuiz(request: GenerateQuizRequest): Promise<ApiResponse<Quiz>> {
  return fetchWithFallback<Quiz>(
    `${API_BASE_URL}/generate-quiz`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    { ...fallbackQuiz, topic: request.topic, title: `${request.topic} Quiz` }
  );
}

export async function submitQuiz(request: SubmitQuizRequest): Promise<ApiResponse<QuizResult>> {
  // Calculate result locally for fallback
  const quiz = fallbackQuiz;
  const correctAnswers = request.answers.filter(
    (answer, index) => answer === quiz.questions[index]?.correctAnswer
  ).length;
  const percentage = Math.round((correctAnswers / quiz.questions.length) * 100);

  const fallbackResult: QuizResult = {
    quizId: request.quizId,
    score: correctAnswers,
    totalQuestions: quiz.questions.length,
    percentage,
    passed: percentage >= quiz.passingScore,
    answers: request.answers,
    completedAt: new Date().toISOString(),
  };

  return fetchWithFallback<QuizResult>(
    `${API_BASE_URL}/submit-quiz`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    fallbackResult
  );
}

export async function mintCredential(request: MintCredentialRequest): Promise<ApiResponse<Certificate>> {
  const fallbackCertificate: Certificate = {
    id: `cert-${Date.now()}`,
    title: `${request.certificateData.topic} Certificate`,
    description: `Successfully completed the ${request.certificateData.topic} course`,
    recipientAddress: request.walletAddress,
    recipientName: request.certificateData.recipientName,
    issueDate: new Date().toISOString(),
    topic: request.certificateData.topic,
    score: request.certificateData.score,
    imageUrl: '/placeholder.svg',
    minted: false,
  };

  return fetchWithFallback<Certificate>(
    `${API_BASE_URL}/mint-credential`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    fallbackCertificate
  );
}

export async function getCredentials(walletAddress: string): Promise<ApiResponse<Certificate[]>> {
  return fetchWithFallback<Certificate[]>(
    `${API_BASE_URL}/credentials/${walletAddress}`,
    { method: 'GET' },
    fallbackCertificates.map(cert => ({ ...cert, recipientAddress: walletAddress }))
  );
}

export async function getCertificatesByWallet(
  wallet: string
): Promise<ApiResponse<Certificate[]>> {
  return fetchWithFallback<Certificate[]>(
    `${API_BASE_URL}/credential/${wallet}`,
    { method: 'GET' },
    fallbackCertificates.map(cert => ({
      ...cert,
      recipientAddress: wallet
    }))
  );
}


export { fallbackQuiz };
