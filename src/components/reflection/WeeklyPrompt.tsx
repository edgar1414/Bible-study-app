import { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import { useJournal } from '../../hooks/useJournal';
import { WEEKLY_PROMPTS } from '../../lib/constants';
import { getWeek } from 'date-fns';
import { Sparkles, Check } from 'lucide-react';

export function WeeklyPrompt() {
  const weekNumber = getWeek(new Date());
  const prompt = WEEKLY_PROMPTS[weekNumber % WEEKLY_PROMPTS.length];
  const [response, setResponse] = useState('');
  const [saved, setSaved] = useState(false);
  const { addEntry } = useJournal();

  const handleSave = async () => {
    if (!response.trim()) return;
    await addEntry({
      date: new Date().toISOString().split('T')[0],
      content: `**Weekly Reflection:** ${prompt}\n\n${response.trim()}`,
      linkedVerses: [],
      type: 'weekly-reflection',
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setResponse('');
    }, 3000);
  };

  if (saved) {
    return (
      <GlassCard className="text-center py-8">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Check size={24} className="text-green-600" />
        </div>
        <p className="text-sm font-medium text-apple-700">Reflection saved</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-accent" />
        <h3 className="text-sm font-semibold text-apple-600">Weekly Reflection</h3>
      </div>

      <p className="text-base text-apple-900 font-medium leading-relaxed italic">
        "{prompt}"
      </p>

      <TextArea
        value={response}
        onChange={e => setResponse(e.target.value)}
        placeholder="Take a moment to reflect..."
        rows={4}
      />

      <div className="flex justify-end">
        <Button size="sm" onClick={handleSave} disabled={!response.trim()}>
          Save Reflection
        </Button>
      </div>
    </GlassCard>
  );
}
