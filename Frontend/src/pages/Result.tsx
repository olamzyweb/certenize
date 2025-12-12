import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, XCircle, Award, RotateCcw, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuizStore } from '@/hooks/useQuizStore';
import { useConfetti } from '@/hooks/useConfetti';
import { Helmet } from 'react-helmet-async';

const Result = () => {
  const VITE_APP_NAME = import.meta.env.VITE_APP_NAME || 'Certenize';
  const navigate = useNavigate();
  const { lastResult, currentQuiz, resetQuiz } = useQuizStore();
  const { fireConfetti, fireStars } = useConfetti();

  useEffect(() => {
    if (!lastResult) {
      navigate('/assessment');
      return;
    }

    if (lastResult.passed) {
      // Celebrate!
      setTimeout(() => {
        fireConfetti();
      }, 500);
      setTimeout(() => {
        fireStars();
      }, 1500);
    }
  }, [lastResult, navigate, fireConfetti, fireStars]);

  if (!lastResult || !currentQuiz) {
    return null;
  }

  const handleTryAgain = () => {
    resetQuiz();
    navigate('/assessment');
  };

  return (
    <>
      {/* Helmet for SEO */}
      <Helmet>
        <title>Assessment Result | {VITE_APP_NAME}</title>
        <meta
          name="description"
          content="View your assessment results and earn Soulbound Tokens at {VITE_APP_NAME}."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Result Icon */}
              <div className="flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className={`
                    w-32 h-32 rounded-3xl flex items-center justify-center
                    ${lastResult.passed 
                      ? 'bg-success/20 border-2 border-success' 
                      : 'bg-destructive/20 border-2 border-destructive'
                    }
                  `}
                >
                  {lastResult.passed ? (
                    <Trophy className="w-16 h-16 text-success" />
                  ) : (
                    <XCircle className="w-16 h-16 text-destructive" />
                  )}
                </motion.div>
              </div>

              {/* Result Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl sm:text-4xl font-bold font-display mb-4">
                  {lastResult.passed ? 'Congratulations!' : 'Almost There!'}
                </h1>
                <p className="text-muted-foreground">
                  {lastResult.passed
                    ? 'You\'ve successfully passed the assessment and earned a certificate!'
                    : 'You didn\'t reach the passing score this time. Keep learning and try again!'}
                </p>
              </motion.div>

              {/* Score Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card variant="glass" className="p-8">
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold font-display text-gradient mb-2">
                      {lastResult.percentage}%
                    </div>
                    <p className="text-muted-foreground">
                      {lastResult.score} out of {lastResult.totalQuestions} correct
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-muted-foreground">Assessment Topic</span>
                      <span className="font-medium">{currentQuiz.topic}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-muted-foreground">Passing Score</span>
                      <span className="font-medium">{currentQuiz.passingScore}%</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-medium
                        ${lastResult.passed 
                          ? 'bg-success/20 text-success' 
                          : 'bg-destructive/20 text-destructive'
                        }
                      `}>
                        {lastResult.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${lastResult.percentage}%` }}
                        transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          lastResult.passed ? 'bg-success' : 'bg-destructive'
                        }`}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>0%</span>
                      <span className="text-primary">{currentQuiz.passingScore}% to pass</span>
                      <span>100%</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              >
                {lastResult.passed ? (
                  <>
                    <Link to="/mint">
                      <Button variant="hero" size="xl" className="w-full sm:w-auto">
                        <Award className="w-5 h-5" />
                        Mint Certificate
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                    <Link to="/gallery">
                      <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                        View Gallery
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button variant="hero" size="xl" onClick={handleTryAgain}>
                      <RotateCcw className="w-5 h-5" />
                      Try Again
                    </Button>
                    <Link to="/">
                      <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                        Back Home
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Result;
