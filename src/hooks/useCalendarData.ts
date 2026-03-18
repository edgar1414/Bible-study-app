import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export interface DayData {
  date: string;
  score: number;
  minutesStudied: number;
  journalCount: number;
  prayerCount: number;
  highlightCount: number;
}

export function useCalendarData(year: number, month: number) {
  const data = useLiveQuery(async () => {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endMonth = month === 11 ? 0 : month + 1;
    const endYear = month === 11 ? year + 1 : year;
    const endDate = `${endYear}-${String(endMonth + 1).padStart(2, '0')}-01`;

    const [sessions, journals, prayers] = await Promise.all([
      db.studySessions.where('date').between(startDate, endDate, true, false).toArray(),
      db.journalEntries.where('date').between(startDate, endDate, true, false).toArray(),
      db.prayerEntries.where('date').between(startDate, endDate, true, false).toArray(),
    ]);

    const dayMap = new Map<string, DayData>();

    const getDay = (date: string): DayData => {
      if (!dayMap.has(date)) {
        dayMap.set(date, {
          date,
          score: 0,
          minutesStudied: 0,
          journalCount: 0,
          prayerCount: 0,
          highlightCount: 0,
        });
      }
      return dayMap.get(date)!;
    };

    sessions.forEach(s => {
      const d = getDay(s.date);
      d.minutesStudied += s.durationMinutes;
    });

    journals.forEach(j => {
      const d = getDay(j.date);
      d.journalCount++;
    });

    prayers.forEach(p => {
      const d = getDay(p.date);
      d.prayerCount++;
    });

    dayMap.forEach(d => {
      d.score = d.minutesStudied * 0.5 + d.journalCount * 2 + d.prayerCount * 2;
    });

    return dayMap;
  }, [year, month], new Map());

  return data;
}

export function useStreak() {
  return useLiveQuery(async () => {
    const sessions = await db.studySessions.orderBy('date').reverse().toArray();
    const journals = await db.journalEntries.orderBy('date').reverse().toArray();
    const prayers = await db.prayerEntries.orderBy('date').reverse().toArray();

    const activeDates = new Set<string>();
    sessions.forEach(s => activeDates.add(s.date));
    journals.forEach(j => activeDates.add(j.date));
    prayers.forEach(p => activeDates.add(p.date));

    let streak = 0;
    const today = new Date();
    const d = new Date(today);

    while (true) {
      const dateStr = d.toISOString().split('T')[0];
      if (activeDates.has(dateStr)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [], 0);
}
