import Dexie, { type Table } from 'dexie';
import type { Highlight, StudySession, MoodLog, ChangedMeVerse, UserSetting } from '../types/tracking';
import type { JournalEntry, PrayerEntry } from '../types/journal';
import type { Tag, VerseTag } from '../types/tags';

export class BibleStudyDB extends Dexie {
  highlights!: Table<Highlight, number>;
  tags!: Table<Tag, number>;
  verseTags!: Table<VerseTag, number>;
  journalEntries!: Table<JournalEntry, number>;
  prayerEntries!: Table<PrayerEntry, number>;
  studySessions!: Table<StudySession, number>;
  moodLogs!: Table<MoodLog, number>;
  changedMeVerses!: Table<ChangedMeVerse, number>;
  settings!: Table<UserSetting, number>;

  constructor() {
    super('BibleStudyApp');
    this.version(1).stores({
      highlights: '++id, verseId, color, createdAt',
      tags: '++id, &name, createdAt',
      verseTags: '++id, verseId, tagId, [verseId+tagId]',
      journalEntries: '++id, date, type, createdAt',
      prayerEntries: '++id, date, createdAt',
      studySessions: '++id, date, startTime',
      moodLogs: '++id, date, sessionId, createdAt',
      changedMeVerses: '++id, &verseId, addedAt',
      settings: '++id, &key',
    });
  }
}

export const db = new BibleStudyDB();
