import { useEffect, useRef } from 'react';
import { db } from '../db';
import { useAppStore } from '../stores/useAppStore';
import type { StudySession } from '../types/tracking';

export function useStudySession() {
  const { activeSession, startSession, updateElapsed, endSession } = useAppStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activeSession) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - activeSession.startTime.getTime()) / 1000
        );
        updateElapsed(elapsed);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeSession?.startTime]);

  const start = () => {
    startSession();
  };

  const stop = async () => {
    if (!activeSession) return null;
    const now = new Date();
    const durationMinutes = Math.round(
      (now.getTime() - activeSession.startTime.getTime()) / 60000
    );
    const session: StudySession = {
      date: now.toISOString().split('T')[0],
      startTime: activeSession.startTime,
      endTime: now,
      durationMinutes: Math.max(1, durationMinutes),
      booksRead: [],
      chaptersRead: [],
    };
    const id = await db.studySessions.add(session);
    endSession();
    return id;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return {
    isActive: !!activeSession,
    elapsed: activeSession?.elapsed ?? 0,
    formattedTime: formatTime(activeSession?.elapsed ?? 0),
    start,
    stop,
  };
}
