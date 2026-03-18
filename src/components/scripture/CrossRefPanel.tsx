import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { useCrossReferences } from '../../hooks/useCrossReferences';
import { parseVerseId, formatVerseRef } from '../../types/bible';
import { useScriptureStore } from '../../stores/useScriptureStore';
import { useAppStore } from '../../stores/useAppStore';

interface CrossRefPanelProps {
  verseId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface RefWithText {
  id: string;
  text: string;
  ref: string;
}

export function CrossRefPanel({ verseId, isOpen, onClose }: CrossRefPanelProps) {
  const { refs, isLoading, getCrossRefs } = useCrossReferences();
  const [refsWithText, setRefsWithText] = useState<RefWithText[]>([]);
  const { setBook, setChapter } = useScriptureStore();
  const { setSelectedVerse } = useAppStore();

  useEffect(() => {
    if (verseId && isOpen) {
      getCrossRefs(verseId);
    }
  }, [verseId, isOpen]);

  useEffect(() => {
    if (refs.length === 0) {
      setRefsWithText([]);
      return;
    }

    const loadTexts = async () => {
      const loaded: RefWithText[] = [];
      for (const refId of refs.slice(0, 10)) {
        try {
          const { book } = parseVerseId(refId);
          const res = await fetch(`/bible/${book}.json`);
          if (!res.ok) continue;
          const data = await res.json();
          const parsed = parseVerseId(refId);
          const ch = data.chapters?.find((c: { chapter: number }) => c.chapter === parsed.chapter);
          const v = ch?.verses?.find((v: { verse: number }) => v.verse === parsed.verse);
          if (v) {
            loaded.push({ id: refId, text: v.text, ref: formatVerseRef(refId) });
          }
        } catch {
          // skip failed loads
        }
      }
      setRefsWithText(loaded);
    };

    loadTexts();
  }, [refs]);

  const navigateTo = (refId: string) => {
    const { book, chapter } = parseVerseId(refId);
    setBook(book);
    setChapter(chapter);
    setSelectedVerse(refId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={verseId ? `Cross References — ${formatVerseRef(verseId)}` : 'Cross References'}>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : refsWithText.length === 0 ? (
        <p className="text-center text-apple-400 py-8 text-sm">
          No cross-references found for this verse.
        </p>
      ) : (
        <div className="space-y-3 pb-6">
          {refsWithText.map(({ id, text, ref }) => (
            <button
              key={id}
              onClick={() => navigateTo(id)}
              className="w-full text-left p-3 rounded-xl bg-apple-50 hover:bg-apple-100 transition-colors"
            >
              <p className="text-xs font-medium text-accent mb-1">{ref}</p>
              <p className="text-sm text-apple-700 leading-relaxed">{text}</p>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}
