import { useStudySession } from '../../hooks/useStudySession';
import { Button } from '../ui/Button';
import { Play, Square, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function StudyTimer() {
  const { isActive, formattedTime, stop } = useStudySession();

  return (
    <AnimatePresence>
      {isActive ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed top-4 right-4 z-20 glass-strong rounded-2xl px-4 py-2.5 flex items-center gap-3"
        >
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="text-sm font-mono font-medium text-apple-900">{formattedTime}</span>
          <button
            onClick={stop}
            className="p-1 rounded-lg bg-apple-100 text-apple-600 hover:bg-apple-200 transition-colors"
          >
            <Square size={14} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function StudyTimerControl() {
  const { isActive, formattedTime, start, stop } = useStudySession();

  return (
    <div className="flex items-center gap-3">
      <Clock size={18} className="text-apple-500" />
      {isActive ? (
        <>
          <span className="text-sm font-mono font-medium text-apple-900">{formattedTime}</span>
          <Button variant="secondary" size="sm" onClick={stop}>
            <Square size={12} className="mr-1" />
            Stop
          </Button>
        </>
      ) : (
        <Button variant="secondary" size="sm" onClick={start}>
          <Play size={12} className="mr-1" />
          Start Study Session
        </Button>
      )}
    </div>
  );
}
