import { useState } from 'react';
import { MOOD_OPTIONS } from '../../lib/constants';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { useMoodLog } from '../../hooks/useMoodLog';

interface MoodSelectorProps {
  type: 'before' | 'after';
  onComplete?: () => void;
}

export function MoodSelector({ type, onComplete }: MoodSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const { addLog, updateLog, getLogByDate } = useMoodLog();

  const handleSave = async () => {
    if (!selected) return;
    const today = new Date().toISOString().split('T')[0];
    const existing = await getLogByDate(today);

    if (type === 'before') {
      if (existing) {
        await updateLog(existing.id!, { moodBefore: selected });
      } else {
        await addLog({ date: today, moodBefore: selected });
      }
    } else {
      if (existing) {
        await updateLog(existing.id!, { moodAfter: selected });
      } else {
        await addLog({ date: today, moodBefore: '', moodAfter: selected });
      }
    }
    onComplete?.();
  };

  return (
    <GlassCard className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-apple-600">
          {type === 'before' ? 'How is your heart right now?' : 'How do you feel after studying?'}
        </h3>
        <p className="text-xs text-apple-400 mt-0.5">
          {type === 'before' ? 'Before you begin, check in with yourself.' : 'Notice any shifts in your spirit.'}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {MOOD_OPTIONS.map(mood => (
          <button
            key={mood.label}
            onClick={() => setSelected(mood.emoji)}
            className={`flex flex-col items-center gap-1 py-3 rounded-2xl transition-all ${
              selected === mood.emoji
                ? 'glass-accent ring-2 ring-accent scale-105'
                : 'glass hover:scale-[1.03]'
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-[10px] font-medium text-apple-600">{mood.label}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={handleSave} disabled={!selected}>
          Save
        </Button>
      </div>
    </GlassCard>
  );
}
