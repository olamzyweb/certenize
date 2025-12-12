import { create } from 'zustand';
import type { Quiz, QuizResult } from '@/types';

interface QuizState {
  currentQuiz: Quiz | null;
  currentAnswers: number[];
  currentQuestionIndex: number;
  timeRemaining: number;
  isSubmitting: boolean;
  lastResult: QuizResult | null;
  
  setQuiz: (quiz: Quiz) => void;
  setAnswer: (questionIndex: number, answerIndex: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  setTimeRemaining: (time: number) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setResult: (result: QuizResult) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentQuiz: null,
  currentAnswers: [],
  currentQuestionIndex: 0,
  timeRemaining: 0,
  isSubmitting: false,
  lastResult: null,

  setQuiz: (quiz) => set({
    currentQuiz: quiz,
    currentAnswers: new Array(quiz.questions.length).fill(-1),
    currentQuestionIndex: 0,
    timeRemaining: quiz.timeLimit,
    lastResult: null,
  }),

  setAnswer: (questionIndex, answerIndex) => {
    const { currentAnswers } = get();
    const newAnswers = [...currentAnswers];
    newAnswers[questionIndex] = answerIndex;
    set({ currentAnswers: newAnswers });
  },

  nextQuestion: () => {
    const { currentQuestionIndex, currentQuiz } = get();
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  goToQuestion: (index) => {
    const { currentQuiz } = get();
    if (currentQuiz && index >= 0 && index < currentQuiz.questions.length) {
      set({ currentQuestionIndex: index });
    }
  },

  setTimeRemaining: (time) => set({ timeRemaining: time }),

  setSubmitting: (isSubmitting) => set({ isSubmitting }),

  setResult: (result) => set({ lastResult: result }),

  resetQuiz: () => set({
    currentQuiz: null,
    currentAnswers: [],
    currentQuestionIndex: 0,
    timeRemaining: 0,
    isSubmitting: false,
    lastResult: null,
  }),
}));
