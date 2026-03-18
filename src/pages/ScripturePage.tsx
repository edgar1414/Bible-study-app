import { useState } from 'react';
import { useScriptureStore } from '../stores/useScriptureStore';
import { BookSelector } from '../components/scripture/BookSelector';
import { ChapterSelector } from '../components/scripture/ChapterSelector';
import { ReadingView } from '../components/scripture/ReadingView';
import { HighlightToolbar } from '../components/scripture/HighlightToolbar';
import { CrossRefPanel } from '../components/scripture/CrossRefPanel';
import { StudyTimerControl } from '../components/tracking/StudyTimer';
import { AnimatePresence, motion } from 'framer-motion';

export function ScripturePage() {
  const view = useScriptureStore(s => s.view);
  const [crossRefVerse, setCrossRefVerse] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold gradient-text">Scripture</h1>
        <StudyTimerControl />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15 }}
        >
          {view === 'books' && <BookSelector />}
          {view === 'chapters' && <ChapterSelector />}
          {view === 'reading' && <ReadingView />}
        </motion.div>
      </AnimatePresence>

      <HighlightToolbar
        onCrossRef={(verseId) => setCrossRefVerse(verseId)}
      />

      <CrossRefPanel
        verseId={crossRefVerse}
        isOpen={!!crossRefVerse}
        onClose={() => setCrossRefVerse(null)}
      />
    </div>
  );
}
