export interface Tag {
  id?: number;
  name: string;
  color: string;
  createdAt: Date;
}

export interface VerseTag {
  id?: number;
  verseId: string;
  tagId: number;
  createdAt: Date;
}
