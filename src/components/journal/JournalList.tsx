import { useJournal } from '../../hooks/useJournal';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { format } from 'date-fns';
import { formatVerseRef } from '../../types/bible';
import { Trash2 } from 'lucide-react';

export function JournalList() {
  const { entries, deleteEntry } = useJournal();

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-apple-400 text-sm">No journal entries yet.</p>
        <p className="text-apple-400 text-xs mt-1">Start writing your reflections above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map(entry => (
        <GlassCard key={entry.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-apple-400">
              {format(new Date(entry.createdAt), 'MMM d, yyyy · h:mm a')}
            </span>
            <div className="flex items-center gap-2">
              {entry.type === 'weekly-reflection' && (
                <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                  Weekly
                </span>
              )}
              <button
                onClick={() => deleteEntry(entry.id!)}
                className="text-apple-400 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <p className="text-sm text-apple-700 leading-relaxed whitespace-pre-wrap">
            {entry.content}
          </p>
          {entry.linkedVerses.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {entry.linkedVerses.map(v => (
                <Badge key={v} color="#007AFF">
                  {formatVerseRef(v)}
                </Badge>
              ))}
            </div>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
