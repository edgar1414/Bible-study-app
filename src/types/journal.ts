export interface JournalEntry {
  id?: number;
  date: string;
  content: string;
  linkedVerses: string[];
  type: 'reflection' | 'note' | 'weekly-reflection';
  createdAt: Date;
  updatedAt: Date;
}

export interface PrayerEntry {
  id?: number;
  date: string;
  praise: string;
  repent: string;
  ask: string;
  yield: string;
  createdAt: Date;
}
