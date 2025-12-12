import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizTimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  isPaused?: boolean;
}

export function QuizTimer({ initialTime, onTimeUp, isPaused = false }: QuizTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, onTimeUp, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (timeRemaining / initialTime) * 100;
  const isLow = percentage < 20;
  const isCritical = percentage < 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass-card px-4 py-2 rounded-xl flex items-center gap-3',
        isCritical && 'animate-pulse border-destructive'
      )}
    >
      <Clock className={cn(
        'w-5 h-5',
        isCritical ? 'text-destructive' : isLow ? 'text-warning' : 'text-muted-foreground'
      )} />
      
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'font-mono text-lg font-semibold',
            isCritical ? 'text-destructive' : isLow ? 'text-warning' : 'text-foreground'
          )}
        >
          {formatTime(timeRemaining)}
        </span>
        
        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full',
              isCritical ? 'bg-destructive' : isLow ? 'bg-warning' : 'bg-primary'
            )}
            initial={{ width: '100%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
