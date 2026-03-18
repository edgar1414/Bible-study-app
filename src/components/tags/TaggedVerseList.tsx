import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useTags } from '../../hooks/useTags';
import { db } from '../../db';
import { GlassCard } from '../ui/GlassCard';
import { formatVerseRef } from '../../types/bible';

export function TaggedVerseList() {
  const { tags } = useTags();
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  const taggedVerses = useLiveQuery(async () => {
    if (selectedTagId == null) return [];
    return db.verseTags.where('tagId').equals(selectedTagId).toArray();
  }, [selectedTagId], []);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-apple-600">Tagged Verses</h3>

      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => setSelectedTagId(selectedTagId === tag.id ? null : tag.id!)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedTagId === tag.id ? 'ring-2 ring-offset-1' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: `${tag.color}20`,
              color: tag.color,
              ...(selectedTagId === tag.id ? { ringColor: tag.color } : {}),
            }}
          >
            {tag.name}
          </button>
        ))}
      </div>

      {selectedTagId && taggedVerses.length === 0 && (
        <p className="text-xs text-apple-400 text-center py-4">No verses tagged yet.</p>
      )}

      {taggedVerses.length > 0 && (
        <div className="space-y-2">
          {taggedVerses.map(vt => (
            <GlassCard key={vt.id} className="py-3 px-4">
              <p className="text-sm font-medium text-accent">
                {formatVerseRef(vt.verseId)}
              </p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
