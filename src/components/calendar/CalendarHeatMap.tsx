import { useState } from 'react';
import { useCalendarData, useStreak, type DayData } from '../../hooks/useCalendarData';
import { GlassCard } from '../ui/GlassCard';
import { Modal } from '../ui/Modal';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { format, startOfMonth, getDay, getDaysInMonth } from 'date-fns';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getIntensity(score: number): string {
  if (score === 0) return 'bg-white/40';
  if (score < 3) return 'bg-accent/15';
  if (score < 6) return 'bg-accent/30';
  if (score < 10) return 'bg-accent/50';
  return 'bg-accent/70';
}

export function CalendarHeatMap() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const data = useCalendarData(year, month);
  const streak = useStreak();

  const firstDay = getDay(startOfMonth(new Date(year, month)));
  const daysInMonth = getDaysInMonth(new Date(year, month));

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return { day, dateStr, data: data.get(dateStr) };
  });

  return (
    <>
      <GlassCard className="space-y-4">
        {streak > 0 && (
          <div className="flex items-center gap-2 rounded-2xl px-3 py-2" style={{ background: 'rgba(0,122,255,0.08)' }}>
            <Flame size={16} className="text-accent" />
            <span className="text-sm font-semibold gradient-text">{streak} day streak</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button onClick={prevMonth} className="p-1 text-apple-500 hover:text-apple-700">
            <ChevronLeft size={18} />
          </button>
          <h3 className="text-sm font-semibold text-apple-700">
            {format(new Date(year, month), 'MMMM yyyy')}
          </h3>
          <button onClick={nextMonth} className="p-1 text-apple-500 hover:text-apple-700">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-medium text-apple-400 py-1">
              {d}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(({ day, data: dayData }) => (
            <button
              key={day}
              onClick={() => dayData && setSelectedDay(dayData)}
              className={`aspect-square rounded-lg text-xs flex items-center justify-center transition-colors ${
                getIntensity(dayData?.score ?? 0)
              } ${dayData ? 'cursor-pointer hover:ring-2 hover:ring-accent/30' : ''}`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-1 text-[10px] text-apple-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded bg-white/40" />
          <div className="w-3 h-3 rounded bg-accent/15" />
          <div className="w-3 h-3 rounded bg-accent/30" />
          <div className="w-3 h-3 rounded bg-accent/50" />
          <div className="w-3 h-3 rounded bg-accent/70" />
          <span>More</span>
        </div>
      </GlassCard>

      <Modal
        isOpen={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        title={selectedDay ? format(new Date(selectedDay.date), 'MMMM d, yyyy') : ''}
      >
        {selectedDay && (
          <div className="space-y-3 pb-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-2xl p-3 text-center">
                <p className="text-2xl font-semibold text-apple-900">{selectedDay.minutesStudied}</p>
                <p className="text-xs text-apple-500">Minutes Studied</p>
              </div>
              <div className="glass rounded-2xl p-3 text-center">
                <p className="text-2xl font-semibold text-apple-900">{selectedDay.journalCount}</p>
                <p className="text-xs text-apple-500">Journal Entries</p>
              </div>
              <div className="glass rounded-2xl p-3 text-center">
                <p className="text-2xl font-semibold text-apple-900">{selectedDay.prayerCount}</p>
                <p className="text-xs text-apple-500">Prayer Sessions</p>
              </div>
              <div className="glass rounded-2xl p-3 text-center">
                <p className="text-2xl font-semibold text-apple-900">{selectedDay.highlightCount}</p>
                <p className="text-xs text-apple-500">Highlights</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
