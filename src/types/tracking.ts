export interface Highlight {
  id?: number;
  verseId: string;
  color: string;
  createdAt: Date;
}

export interface StudySession {
  id?: number;
  date: string;
  startTime: Date;
  endTime?: Date;
  durationMinutes: number;
  booksRead: string[];
  chaptersRead: string[];
}

export interface MoodLog {
  id?: number;
  date: string;
  sessionId?: number;
  moodBefore: string;
  moodAfter?: string;
  createdAt: Date;
}

export interface ChangedMeVerse {
  id?: number;
  verseId: string;
  verseText: string;
  personalNote: string;
  addedAt: Date;
}

export interface UserSetting {
  id?: number;
  key: string;
  value: string;
}
