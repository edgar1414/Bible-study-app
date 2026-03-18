import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import type { MoodLog } from '../types/tracking';

export function useMoodLog() {
  const logs = useLiveQuery(
    () => db.moodLogs.orderBy('createdAt').reverse().toArray(),
    [],
    []
  );

  const addLog = async (log: Omit<MoodLog, 'id' | 'createdAt'>) => {
    await db.moodLogs.add({ ...log, createdAt: new Date() } as MoodLog);
  };

  const updateLog = async (id: number, updates: Partial<MoodLog>) => {
    await db.moodLogs.update(id, updates);
  };

  const getLogByDate = async (date: string) => {
    return db.moodLogs.where('date').equals(date).first();
  };

  return { logs, addLog, updateLog, getLogByDate };
}
