import { useChangedMe } from '../../hooks/useChangedMe';
import { GlassCard } from '../ui/GlassCard';
import { formatVerseRef, parseVerseId } from '../../types/bible';
import { format } from 'date-fns';
import { Heart, Trash2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useScriptureStore } from '../../stores/useScriptureStore';

export function ChangedMeList() {
  const { verses, removeVerse } = useChangedMe();
  const navigate = useNavigate();
  const { setBook, setChapter } = useScriptureStore();

  const goToVerse = (verseId: string) => {
    const { book, chapter } = parseVerseId(verseId);
    setBook(book);
    setChapter(chapter);
    navigate('/');
  };

  if (!verses || verses.length === 0) {
    return (
      <GlassCard className="text-center py-12">
        <Heart size={32} className="text-apple-300 mx-auto mb-3" />
        <p className="text-sm text-apple-400">No verses saved yet.</p>
        <p className="text-xs text-apple-400 mt-1">
          Tap the heart icon on any verse to add it to your collection.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-3">
      {verses.map(v => (
        <GlassCard key={v.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => goToVerse(v.verseId)}
              className="flex items-center gap-1.5 text-xs font-medium text-accent hover:opacity-70 transition-opacity"
            >
              <BookOpen size={12} />
              {formatVerseRef(v.verseId)}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-apple-400">
                {format(new Date(v.addedAt), 'MMM d, yyyy')}
              </span>
              <button
                onClick={() => removeVerse(v.verseId)}
                className="text-apple-400 hover:text-red-400 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
          {v.personalNote && (
            <p className="text-sm text-apple-700 italic leading-relaxed">
              "{v.personalNote}"
            </p>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
