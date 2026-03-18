import { create } from 'zustand';

interface ScriptureState {
  currentBook: string | null;
  currentChapter: number | null;
  view: 'books' | 'chapters' | 'reading';
  setBook: (book: string) => void;
  setChapter: (chapter: number) => void;
  setView: (view: 'books' | 'chapters' | 'reading') => void;
  goBack: () => void;
}

export const useScriptureStore = create<ScriptureState>((set, get) => ({
  currentBook: null,
  currentChapter: null,
  view: 'books',

  setBook: (book) => set({ currentBook: book, view: 'chapters' }),
  setChapter: (chapter) => set({ currentChapter: chapter, view: 'reading' }),
  setView: (view) => set({ view }),

  goBack: () => {
    const { view } = get();
    if (view === 'reading') set({ view: 'chapters', currentChapter: null });
    else if (view === 'chapters') set({ view: 'books', currentBook: null });
  },
}));
