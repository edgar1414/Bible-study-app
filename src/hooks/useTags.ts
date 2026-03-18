import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import type { Tag, VerseTag } from '../types/tags';

export function useTags() {
  const tags = useLiveQuery(() => db.tags.toArray(), [], []);

  const addTag = async (name: string, color: string) => {
    await db.tags.add({ name, color, createdAt: new Date() } as Tag);
  };

  const deleteTag = async (id: number) => {
    await db.transaction('rw', db.tags, db.verseTags, async () => {
      await db.verseTags.where('tagId').equals(id).delete();
      await db.tags.delete(id);
    });
  };

  return { tags, addTag, deleteTag };
}

export function useVerseTags(verseId?: string) {
  const verseTags = useLiveQuery(async () => {
    if (!verseId) return [];
    const vts = await db.verseTags.where('verseId').equals(verseId).toArray();
    const tagIds = vts.map(vt => vt.tagId);
    return db.tags.where('id').anyOf(tagIds).toArray();
  }, [verseId], []);

  const toggleTag = async (vId: string, tagId: number) => {
    const existing = await db.verseTags
      .where('[verseId+tagId]')
      .equals([vId, tagId])
      .first();
    if (existing) {
      await db.verseTags.delete(existing.id!);
    } else {
      await db.verseTags.add({ verseId: vId, tagId, createdAt: new Date() } as VerseTag);
    }
  };

  const getVerseTagIds = async (vId: string): Promise<number[]> => {
    const vts = await db.verseTags.where('verseId').equals(vId).toArray();
    return vts.map(vt => vt.tagId);
  };

  return { verseTags, toggleTag, getVerseTagIds };
}
