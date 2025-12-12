import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

interface QuizGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export function QuizGuard({ children, redirectTo }: QuizGuardProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I','C','J'].includes(e.key.toUpperCase()))
      ) {
        e.preventDefault();
        alert("Inspecting the quiz is disabled!");
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
