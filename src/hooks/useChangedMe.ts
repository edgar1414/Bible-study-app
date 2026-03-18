import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import type { ChangedMeVerse } from '../types/tracking';

export function useChangedMe() {
  const verses = useLiveQuery(
    () => db.changedMeVerses.orderBy('addedAt').reverse().toArray(),
    [],
    []
  );

  const addVerse = async (verse: Omit<ChangedMeVerse, 'id' | 'addedAt'>) => {
    const existing = await db.changedMeVerses.where('verseId').equals(verse.verseId).first();
    if (existing) return;
    await db.changedMeVerses.add({ ...verse, addedAt: new Date() } as ChangedMeVerse);
  };

  const removeVerse = async (verseId: string) => {
    await db.changedMeVerses.where('verseId').equals(verseId).delete();
  };

  const isChangedMe = (verseId: string): boolean => {
    return !!verses?.find(v => v.verseId === verseId);
  };

  return { verses, addVerse, removeVerse, isChangedMe };
}
