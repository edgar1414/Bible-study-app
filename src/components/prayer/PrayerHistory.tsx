import { usePrayer } from '../../hooks/usePrayer';
import { GlassCard } from '../ui/GlassCard';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

export function PrayerHistory() {
  const { entries, deleteEntry } = usePrayer();

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-apple-400 text-sm">No prayer entries yet.</p>
        <p className="text-apple-400 text-xs mt-1">Begin a PRAY session above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-apple-500 uppercase tracking-wider">
        Prayer History
      </h3>
      {entries.map(entry => (
        <GlassCard key={entry.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-apple-400">
              {format(new Date(entry.createdAt), 'MMM d, yyyy · h:mm a')}
            </span>
            <button
              onClick={() => deleteEntry(entry.id!)}
              className="text-apple-400 hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
          {entry.praise && (
            <div>
              <span className="text-xs font-semibold text-accent">Praise</span>
              <p className="text-sm text-apple-700 mt-0.5">{entry.praise}</p>
            </div>
          )}
          {entry.repent && (
            <div>
              <span className="text-xs font-semibold text-accent">Repent</span>
              <p className="text-sm text-apple-700 mt-0.5">{entry.repent}</p>
            </div>
          )}
          {entry.ask && (
            <div>
              <span className="text-xs font-semibold text-accent">Ask</span>
              <p className="text-sm text-apple-700 mt-0.5">{entry.ask}</p>
            </div>
          )}
          {entry.yield && (
            <div>
              <span className="text-xs font-semibold text-accent">Yield</span>
              <p className="text-sm text-apple-700 mt-0.5">{entry.yield}</p>
            </div>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
