import { useMoodLog } from '../../hooks/useMoodLog';
import { GlassCard } from '../ui/GlassCard';
import { format } from 'date-fns';

export function MoodPatterns() {
  const { logs } = useMoodLog();

  const recentLogs = (logs ?? []).slice(0, 10);

  return (
    <GlassCard className="space-y-3">
      <h3 className="text-sm font-semibold text-apple-600">Heart State Log</h3>

      {recentLogs.length === 0 ? (
        <p className="text-xs text-apple-400 text-center py-6">
          Log your mood before and after study to see patterns here.
        </p>
      ) : (
        <div className="space-y-2">
          {recentLogs.map(log => (
            <div
              key={log.id}
              className="flex items-center gap-3 py-2 px-3 rounded-2xl glass"
            >
              <span className="text-xs text-apple-400 w-16">
                {format(new Date(log.createdAt), 'MMM d')}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg" title="Before">{log.moodBefore || '—'}</span>
                <span className="text-apple-300 text-xs">→</span>
                <span className="text-lg" title="After">{log.moodAfter || '—'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
