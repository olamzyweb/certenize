import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { QuizQuestion } from '@/types';

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number;
  onSelectAnswer: (answerIndex: number) => void;
  showResult?: boolean;
}

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  showResult = false,
}: QuizCardProps) {
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="glass" className="p-6 sm:p-8">
        {/* Question Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="h-1 flex-1 mx-4 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              className="h-full bg-primary"
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="text-xl sm:text-2xl font-semibold font-display mb-8">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = showResult && index === question.correctAnswer;
            const isWrongSelected = showResult && isSelected && !isCorrect;

            return (
              <motion.button
                key={index}
                onClick={() => !showResult && onSelectAnswer(index)}
                disabled={showResult}
                whileHover={!showResult ? { scale: 1.01 } : {}}
                whileTap={!showResult ? { scale: 0.99 } : {}}
                className={cn(
                  'w-full p-4 rounded-xl text-left transition-all duration-200',
                  'border flex items-center gap-4 group',
                  !showResult && !isSelected && 'border-border hover:border-primary/50 hover:bg-accent/50',
                  !showResult && isSelected && 'border-primary bg-primary/10',
                  showResult && isCorrectOption && 'border-success bg-success/10',
                  showResult && isWrongSelected && 'border-destructive bg-destructive/10',
                  showResult && !isCorrectOption && !isWrongSelected && 'border-border opacity-50'
                )}
              >
                <span
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium',
                    'border transition-colors shrink-0',
                    !showResult && !isSelected && 'border-border bg-secondary',
                    !showResult && isSelected && 'border-primary bg-primary text-primary-foreground',
                    showResult && isCorrectOption && 'border-success bg-success text-success-foreground',
                    showResult && isWrongSelected && 'border-destructive bg-destructive text-destructive-foreground',
                    showResult && !isCorrectOption && !isWrongSelected && 'border-border bg-secondary'
                  )}
                >
                  {showResult && isCorrectOption ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </span>
                <span className="flex-1">{option}</span>
              </motion.button>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
