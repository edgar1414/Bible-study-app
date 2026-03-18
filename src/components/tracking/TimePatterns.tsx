import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { GlassCard } from '../ui/GlassCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';

export function TimePatterns() {
  const data = useLiveQuery(async () => {
    const today = new Date();
    const days = [];

    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const sessions = await db.studySessions.where('date').equals(dateStr).toArray();
      const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
      days.push({
        date: format(date, 'MMM d'),
        minutes: totalMinutes,
      });
    }

    return days;
  }, [], []);

  const hasData = data.some(d => d.minutes > 0);

  return (
    <GlassCard className="space-y-3">
      <h3 className="text-sm font-semibold text-apple-600">Study Time — Last 30 Days</h3>

      {!hasData ? (
        <p className="text-xs text-apple-400 text-center py-8">
          Start a study session to see your time patterns here.
        </p>
      ) : (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: '#8E8E93' }}
                interval={6}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: '#8E8E93' }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
                formatter={(value) => [`${value} min`, 'Study Time']}
              />
              <Bar dataKey="minutes" fill="#007AFF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}
