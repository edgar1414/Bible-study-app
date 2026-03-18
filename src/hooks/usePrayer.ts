import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import type { PrayerEntry } from '../types/journal';

export function usePrayer() {
  const entries = useLiveQuery(
    () => db.prayerEntries.orderBy('createdAt').reverse().toArray(),
    [],
    []
  );

  const addEntry = async (entry: Omit<PrayerEntry, 'id' | 'createdAt'>) => {
    await db.prayerEntries.add({
      ...entry,
      createdAt: new Date(),
    } as PrayerEntry);
  };

  const deleteEntry = async (id: number) => {
    await db.prayerEntries.delete(id);
  };

  return { entries, addEntry, deleteEntry };
}
