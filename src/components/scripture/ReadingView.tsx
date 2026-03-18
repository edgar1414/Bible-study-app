import { useScriptureStore } from '../../stores/useScriptureStore';
import { useBibleText } from '../../hooks/useBibleText';
import { useHighlights } from '../../hooks/useHighlights';
import { useAppStore } from '../../stores/useAppStore';
import { createVerseId } from '../../types/bible';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getBookMeta } from '../../lib/bible';

export function ReadingView() {
  const { currentBook, currentChapter, goBack, setChapter } = useScriptureStore();
  const { book, loading, error } = useBibleText(currentBook);
  const { getHighlightColor } = useHighlights(currentBook ?? undefined, currentChapter ?? undefined);
  const { selectedVerseId, setSelectedVerse } = useAppStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-apple-500">
        <p>Unable to load Scripture text.</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (!book || currentChapter == null) return null;

  const chapter = book.chapters.find(c => c.chapter === currentChapter);
  if (!chapter) return null;

  const meta = getBookMeta(currentBook!);
  const hasPrev = currentChapter > 1;
  const hasNext = meta ? currentChapter < meta.chapters : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-sm text-accent font-medium hover:opacity-80 transition-opacity"
        >
          <ChevronLeft size={18} />
          {currentBook}
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-apple-900">
        Chapter {currentChapter}
      </h2>

      <div className="space-y-1">
        {chapter.verses.map(v => {
          const verseId = createVerseId(currentBook!, currentChapter, v.verse);
          const highlightColor = getHighlightColor(verseId);
          const isSelected = selectedVerseId === verseId;

          return (
            <span
              key={v.verse}
              onClick={() => setSelectedVerse(isSelected ? null : verseId)}
              className={`inline cursor-pointer transition-colors rounded px-0.5 ${
                isSelected ? 'ring-2 ring-accent/40 rounded-md' : ''
              }`}
              style={highlightColor ? { backgroundColor: highlightColor } : undefined}
            >
              <sup className="text-xs text-apple-400 font-medium mr-1 select-none">
                {v.verse}
              </sup>
              <span className="text-lg leading-loose text-apple-900">
                {v.text}{' '}
              </span>
            </span>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-8 pb-4">
        <button
          onClick={() => hasPrev && setChapter(currentChapter - 1)}
          disabled={!hasPrev}
          className={`flex items-center gap-1 text-sm font-medium transition-opacity ${
            hasPrev ? 'text-accent hover:opacity-80' : 'text-apple-300 cursor-not-allowed'
          }`}
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <span className="text-xs text-apple-400">
          {currentBook} {currentChapter}
        </span>
        <button
          onClick={() => hasNext && setChapter(currentChapter + 1)}
          disabled={!hasNext}
          className={`flex items-center gap-1 text-sm font-medium transition-opacity ${
            hasNext ? 'text-accent hover:opacity-80' : 'text-apple-300 cursor-not-allowed'
          }`}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
