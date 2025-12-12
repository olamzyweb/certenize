import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Send, RefreshCw } from 'lucide-react';
import { useAccount } from 'wagmi';
import { Navbar } from '@/components/layout/Navbar';
import { WalletGuard } from '@/components/auth/WalletGuard';
import { QuizCard } from '@/components/quiz/QuizCard';
import { QuizTimer } from '@/components/quiz/QuizTimer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { generateQuiz, submitQuiz, fallbackQuiz } from '@/lib/api';
import { useQuizStore } from '@/hooks/useQuizStore';
import { toast } from '@/hooks/use-toast';
import type { Quiz } from '@/types';
import { Helmet } from 'react-helmet-async';

const topics = [
  'Blockchain Fundamentals',
  'Smart Contracts',
  'DeFi Basics',
  'NFT Technology',
  'Ethereum Development',
  'Web3 Security',
];

const QuizPage = () => {
  const VITE_APP_NAME = import.meta.env.VITE_APP_NAME || 'Certenize';
  const navigate = useNavigate();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [startTime, setStartTime] = useState<number>(0);

  const {
    currentQuiz,
    currentAnswers,
    currentQuestionIndex,
    isSubmitting,
    setQuiz,
    setAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    setSubmitting,
    setResult,
    resetQuiz,
  } = useQuizStore();

  const handleStartQuiz = async () => {
    const topic = selectedTopic || customTopic;

    if (!topic) {
      toast({
        title: 'Select a topic',
        description: 'Please choose or enter a quiz topic',
        variant: 'destructive',
      });
      return;
    }

    if (!address) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to start the quiz.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Starting quiz for wallet:', address, 'topic:', topic);
      const response = await generateQuiz({ wallet: address, topic });
      console.log('Quiz API response:', response);

      if (response.success && response.data) {
        setQuiz(response.data);
        setStartTime(Date.now());
      } else {
        console.warn('Quiz API returned no data or success=false, using fallback');
        setQuiz({ ...fallbackQuiz, topic, title: `${topic} Quiz` });
        setStartTime(Date.now());
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setQuiz({ ...fallbackQuiz, topic, title: `${topic} Quiz` });
      setStartTime(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = useCallback(async () => {
    if (!currentQuiz || !address) return;
    
    setSubmitting(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
      const response = await submitQuiz({
        quizId: currentQuiz.id,
        answers: currentAnswers,
        walletAddress: address,
        timeTaken,
      });

      if (response.success && response.data) {
        setResult(response.data);
        navigate('/result');
      }
    } catch (error) {
      // Calculate result locally
      const correctAnswers = currentAnswers.filter(
        (answer, index) => answer === currentQuiz.questions[index]?.correctAnswer
      ).length;
      const percentage = Math.round((correctAnswers / currentQuiz.questions.length) * 100);

      setResult({
        quizId: currentQuiz.id,
        score: correctAnswers,
        totalQuestions: currentQuiz.questions.length,
        percentage,
        passed: percentage >= currentQuiz.passingScore,
        answers: currentAnswers,
        completedAt: new Date().toISOString(),
      });
      navigate('/result');
    } finally {
      setSubmitting(false);
    }
  }, [currentQuiz, currentAnswers, address, startTime, setSubmitting, setResult, navigate]);

  const handleTimeUp = useCallback(() => {
    toast({
      title: 'Time\'s up!',
      description: 'Submitting your answers...',
    });
    handleSubmitQuiz();
  }, [handleSubmitQuiz]);

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuiz && currentQuestionIndex === currentQuiz.questions.length - 1;
  const answeredCount = currentAnswers.filter((a) => a !== -1).length;

  return (
    <>
      {/* Helmet for SEO */}
      <Helmet>
        <title>Quiz | {VITE_APP_NAME}</title>
        <meta
          name="description"
          content="Take quizzes on various blockchain topics and earn Soulboundible Counsel."
        />
      </Helmet>

      {/* WalletGuard */}
      <WalletGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
              <AnimatePresence mode="wait">
                {!currentQuiz ? (
                  /* Topic Selection */
                  <motion.div
                    key="topic-selection"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="text-center mb-12">
                      <h1 className="text-3xl sm:text-4xl font-bold font-display mb-4">
                        Choose Your Quiz Topic
                      </h1>
                      <p className="text-muted-foreground max-w-xl mx-auto">
                        Select a topic or enter your own. Score 80% or higher to earn a Soulbound Certificate.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                      {topics.map((topic) => (
                        <motion.button
                          key={topic}
                          onClick={() => {
                            setSelectedTopic(topic);
                            setCustomTopic('');
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            p-4 rounded-xl text-sm font-medium transition-all
                            border ${selectedTopic === topic 
                              ? 'border-primary bg-primary/10 text-foreground' 
                              : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                            }
                          `}
                        >
                          {topic}
                        </motion.button>
                      ))}
                    </div>

                    <div className="relative mb-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-background px-4 text-sm text-muted-foreground">
                          or enter custom topic
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-4 max-w-md mx-auto">
                      <Input
                        placeholder="Enter custom topic..."
                        value={customTopic}
                        onChange={(e) => {
                          setCustomTopic(e.target.value);
                          setSelectedTopic('');
                        }}
                        className="flex-1"
                      />
                    </div>

                    <div className="flex justify-center mt-8">
                      <Button
                        variant="hero"
                        size="xl"
                        onClick={handleStartQuiz}
                        disabled={loading || (!selectedTopic && !customTopic)}
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Generating Quiz...
                          </>
                        ) : (
                          <>
                            Start Quiz
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  /* Quiz Questions */
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {/* Quiz Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h1 className="text-xl font-bold font-display">{currentQuiz.title}</h1>
                        <p className="text-sm text-muted-foreground">
                          {answeredCount} of {currentQuiz.questions.length} answered
                        </p>
                      </div>
                      <QuizTimer
                        initialTime={currentQuiz.timeLimit}
                        onTimeUp={handleTimeUp}
                      />
                    </div>

                    {/* Question Navigation Dots */}
                    <div className="flex justify-center gap-2 mb-8">
                      {currentQuiz.questions.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToQuestion(index)}
                          className={`
                            w-3 h-3 rounded-full transition-all
                            ${index === currentQuestionIndex
                              ? 'bg-primary scale-125'
                              : currentAnswers[index] !== -1
                                ? 'bg-primary/50'
                                : 'bg-secondary hover:bg-accent'
                            }
                          `}
                        />
                      ))}
                    </div>

                    {/* Question Card */}
                    {currentQuestion && (
                      <QuizCard
                        question={currentQuestion}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={currentQuiz.questions.length}
                        selectedAnswer={currentAnswers[currentQuestionIndex]}
                        onSelectAnswer={(answer) => setAnswer(currentQuestionIndex, answer)}
                      />
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8">
                      <Button
                        variant="outline"
                        onClick={previousQuestion}
                        disabled={currentQuestionIndex === 0}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>

                      {isLastQuestion ? (
                        <Button
                          variant="hero"
                          onClick={handleSubmitQuiz}
                          disabled={isSubmitting || answeredCount < currentQuiz.questions.length}
                        >
                          {isSubmitting ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Quiz
                              <Send className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button variant="default" onClick={nextQuestion}>
                          Next
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>

                    {/* Reset Button */}
                    <div className="flex justify-center mt-8">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetQuiz}
                        className="text-muted-foreground"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Start Over
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </WalletGuard>
    </>
  );
};

export default QuizPage;
