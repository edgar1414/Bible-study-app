import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Heart, MessageSquare, X, Link2 } from 'lucide-react';
import { HIGHLIGHT_COLORS } from '../../lib/constants';
import { useHighlights } from '../../hooks/useHighlights';
import { useTags, useVerseTags } from '../../hooks/useTags';
import { useChangedMe } from '../../hooks/useChangedMe';
import { useAppStore } from '../../stores/useAppStore';
import { useScriptureStore } from '../../stores/useScriptureStore';
import { formatVerseRef } from '../../types/bible';

interface HighlightToolbarProps {
  onJournal?: (verseId: string) => void;
  onCrossRef?: (verseId: string) => void;
}

export function HighlightToolbar({ onJournal, onCrossRef }: HighlightToolbarProps) {
  const { selectedVerseId, showHighlightToolbar, setSelectedVerse } = useAppStore();
  const { currentBook, currentChapter } = useScriptureStore();
  const { addHighlight, removeHighlight, getHighlightColor } = useHighlights(currentBook ?? undefined, currentChapter ?? undefined);
  const { tags } = useTags();
  const { toggleTag, getVerseTagIds } = useVerseTags(selectedVerseId ?? undefined);
  const { addVerse: addChangedMe, isChangedMe } = useChangedMe();
  const [showTags, setShowTags] = useState(false);
  const [activeTagIds, setActiveTagIds] = useState<number[]>([]);
  const [showChangedMeInput, setShowChangedMeInput] = useState(false);
  const [changedMeNote, setChangedMeNote] = useState('');

  useEffect(() => {
    if (selectedVerseId) {
      getVerseTagIds(selectedVerseId).then(setActiveTagIds);
    }
  }, [selectedVerseId]);

  if (!showHighlightToolbar || !selectedVerseId) return null;

  const currentColor = getHighlightColor(selectedVerseId);
  const isMarkedChangedMe = isChangedMe(selectedVerseId);

  const handleColorClick = (color: string) => {
    if (currentColor === color) {
      removeHighlight(selectedVerseId);
    } else {
      addHighlight(selectedVerseId, color);
    }
  };

  const handleTagToggle = async (tagId: number) => {
    await toggleTag(selectedVerseId, tagId);
    const updated = await getVerseTagIds(selectedVerseId);
    setActiveTagIds(updated);
  };

  const handleChangedMe = async () => {
    if (!showChangedMeInput) {
      setShowChangedMeInput(true);
      return;
    }
    await addChangedMe({
      verseId: selectedVerseId,
      verseText: formatVerseRef(selectedVerseId),
      personalNote: changedMeNote,
    });
    setShowChangedMeInput(false);
    setChangedMeNote('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-20 left-4 right-4 z-20 glass-strong rounded-2xl p-4 max-w-lg mx-auto"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-apple-500">
            {formatVerseRef(selectedVerseId)}
          </span>
          <button onClick={() => setSelectedVerse(null)} className="text-apple-400 hover:text-apple-600">
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-3">
          {HIGHLIGHT_COLORS.map(({ name, value }) => (
            <button
              key={name}
              onClick={() => handleColorClick(value)}
              className={`w-7 h-7 rounded-full transition-transform ${currentColor === value ? 'ring-2 ring-offset-2 ring-accent scale-110' : 'hover:scale-110'}`}
              style={{ backgroundColor: value }}
              title={name}
            />
          ))}

          <div className="w-px h-6 bg-apple-200 mx-1" />

          <button
            onClick={() => setShowTags(!showTags)}
            className={`p-1.5 rounded-lg transition-colors ${showTags ? 'bg-accent text-white' : 'text-apple-500 hover:bg-apple-100'}`}
            title="Tags"
          >
            <Tag size={16} />
          </button>

          <button
            onClick={handleChangedMe}
            className={`p-1.5 rounded-lg transition-colors ${isMarkedChangedMe ? 'bg-pink-100 text-pink-500' : 'text-apple-500 hover:bg-apple-100'}`}
            title="Verses That Changed Me"
          >
            <Heart size={16} fill={isMarkedChangedMe ? 'currentColor' : 'none'} />
          </button>

          {onJournal && (
            <button
              onClick={() => onJournal(selectedVerseId)}
              className="p-1.5 rounded-lg text-apple-500 hover:bg-apple-100 transition-colors"
              title="Journal"
            >
              <MessageSquare size={16} />
            </button>
          )}

          {onCrossRef && (
            <button
              onClick={() => onCrossRef(selectedVerseId)}
              className="p-1.5 rounded-lg text-apple-500 hover:bg-apple-100 transition-colors"
              title="Cross References"
            >
              <Link2 size={16} />
            </button>
          )}
        </div>

        {showTags && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="flex flex-wrap gap-2 pt-2 border-t border-white/30"
          >
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id!)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  activeTagIds.includes(tag.id!)
                    ? 'ring-2 ring-offset-1'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                  ...(activeTagIds.includes(tag.id!) ? { ringColor: tag.color } : {}),
                }}
              >
                {tag.name}
              </button>
            ))}
          </motion.div>
        )}

        {showChangedMeInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="pt-3 border-t border-white/30"
          >
            <textarea
              value={changedMeNote}
              onChange={e => setChangedMeNote(e.target.value)}
              placeholder="Why did this verse move you?"
              className="w-full rounded-lg border border-white/30 bg-white/60 px-3 py-2 text-sm text-apple-900 placeholder:text-apple-400 focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
              rows={2}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowChangedMeInput(false)}
                className="px-3 py-1 text-xs text-apple-500"
              >
                Cancel
              </button>
              <button
                onClick={handleChangedMe}
                className="px-3 py-1 text-xs bg-accent text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
