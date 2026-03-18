import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import type { JournalEntry } from '../types/journal';

export function useJournal() {
  const entries = useLiveQuery(
    () => db.journalEntries.orderBy('createdAt').reverse().toArray(),
    [],
    []
  );

  const addEntry = async (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    await db.journalEntries.add({
      ...entry,
      createdAt: now,
      updatedAt: now,
    } as JournalEntry);
  };

  const updateEntry = async (id: number, updates: Partial<JournalEntry>) => {
    await db.journalEntries.update(id, { ...updates, updatedAt: new Date() });
  };

  const deleteEntry = async (id: number) => {
    await db.journalEntries.delete(id);
  };

  const getEntriesByDate = async (date: string) => {
    return db.journalEntries.where('date').equals(date).toArray();
  };

  return { entries, addEntry, updateEntry, deleteEntry, getEntriesByDate };
}
