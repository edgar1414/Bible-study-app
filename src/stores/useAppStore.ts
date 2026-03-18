import { create } from 'zustand';

interface AppState {
  selectedVerseId: string | null;
  showHighlightToolbar: boolean;
  activeSession: {
    id?: number;
    startTime: Date;
    elapsed: number;
  } | null;
  setSelectedVerse: (id: string | null) => void;
  setShowHighlightToolbar: (show: boolean) => void;
  startSession: () => void;
  updateElapsed: (elapsed: number) => void;
  endSession: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedVerseId: null,
  showHighlightToolbar: false,
  activeSession: null,

  setSelectedVerse: (id) => set({ selectedVerseId: id, showHighlightToolbar: !!id }),
  setShowHighlightToolbar: (show) => set({ showHighlightToolbar: show }),

  startSession: () => set({
    activeSession: { startTime: new Date(), elapsed: 0 },
  }),
  updateElapsed: (elapsed) => set((state) => ({
    activeSession: state.activeSession ? { ...state.activeSession, elapsed } : null,
  })),
  endSession: () => set({ activeSession: null }),
}));
