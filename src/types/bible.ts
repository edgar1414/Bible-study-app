export type VerseId = string; // "Genesis.1.1" format

export interface BibleVerse {
  verse: number;
  text: string;
}

export interface BibleChapter {
  chapter: number;
  verses: BibleVerse[];
}

export interface BibleBook {
  book: string;
  chapters: BibleChapter[];
}

export interface BookMeta {
  name: string;
  testament: 'OT' | 'NT';
  chapters: number;
  abbreviation: string;
}

export function createVerseId(book: string, chapter: number, verse: number): VerseId {
  return `${book}.${chapter}.${verse}`;
}

export function parseVerseId(id: VerseId): { book: string; chapter: number; verse: number } {
  const parts = id.split('.');
  const verse = parseInt(parts.pop()!, 10);
  const chapter = parseInt(parts.pop()!, 10);
  const book = parts.join('.');
  return { book, chapter, verse };
}

export function formatVerseRef(id: VerseId): string {
  const { book, chapter, verse } = parseVerseId(id);
  return `${book} ${chapter}:${verse}`;
}
