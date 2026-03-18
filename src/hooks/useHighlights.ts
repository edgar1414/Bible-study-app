import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import type { Highlight } from '../types/tracking';

export function useHighlights(bookName?: string, chapter?: number) {
  const highlights = useLiveQuery(async () => {
    if (!bookName || chapter == null) return [];
    const prefix = `${bookName}.${chapter}.`;
    return db.highlights.where('verseId').startsWith(prefix).toArray();
  }, [bookName, chapter], []);

  const addHighlight = async (verseId: string, color: string) => {
    const existing = await db.highlights.where('verseId').equals(verseId).first();
    if (existing) {
      await db.highlights.update(existing.id!, { color });
    } else {
      await db.highlights.add({ verseId, color, createdAt: new Date() } as Highlight);
    }
  };

  const removeHighlight = async (verseId: string) => {
    await db.highlights.where('verseId').equals(verseId).delete();
  };

  const getHighlightColor = (verseId: string): string | undefined => {
    return highlights?.find(h => h.verseId === verseId)?.color;
  };

  return { highlights, addHighlight, removeHighlight, getHighlightColor };
}
