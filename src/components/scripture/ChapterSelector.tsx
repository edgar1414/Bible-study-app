import { useScriptureStore } from '../../stores/useScriptureStore';
import { getBookMeta } from '../../lib/bible';
import { ChevronLeft } from 'lucide-react';

export function ChapterSelector() {
  const { currentBook, setChapter, goBack } = useScriptureStore();
  const meta = currentBook ? getBookMeta(currentBook) : null;

  if (!meta) return null;

  const chapters = Array.from({ length: meta.chapters }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <button
        onClick={goBack}
        className="flex items-center gap-1 text-sm text-accent font-medium hover:opacity-80 transition-opacity"
      >
        <ChevronLeft size={18} />
        All Books
      </button>

      <h2 className="text-xl font-semibold text-apple-900">{currentBook}</h2>

      <div className="grid grid-cols-6 gap-2">
        {chapters.map(ch => (
          <button
            key={ch}
            onClick={() => setChapter(ch)}
            className="aspect-square flex items-center justify-center rounded-2xl text-sm font-medium text-apple-700 glass hover:text-white transition-all"
            style={{ ['--tw-bg-opacity' as string]: undefined }}
            onMouseEnter={e => (e.currentTarget.style.background = '#007AFF')}
            onMouseLeave={e => (e.currentTarget.style.background = '')}
          >
            {ch}
          </button>
        ))}
      </div>
    </div>
  );
}
