import { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import { Badge } from '../ui/Badge';
import { useJournal } from '../../hooks/useJournal';
import { formatVerseRef } from '../../types/bible';
import { BookOpen, X } from 'lucide-react';
import { BIBLE_BOOKS } from '../../lib/bible';

interface JournalEditorProps {
  initialVerseId?: string;
  onSaved?: () => void;
}

export function JournalEditor({ initialVerseId, onSaved }: JournalEditorProps) {
  const [content, setContent] = useState('');
  const [linkedVerses, setLinkedVerses] = useState<string[]>(initialVerseId ? [initialVerseId] : []);
  const [showVersePicker, setShowVersePicker] = useState(false);
  const [pickerBook, setPickerBook] = useState('');
  const [pickerChapter, setPickerChapter] = useState('');
  const [pickerVerse, setPickerVerse] = useState('');
  const { addEntry } = useJournal();

  const handleSave = async () => {
    if (!content.trim()) return;
    await addEntry({
      date: new Date().toISOString().split('T')[0],
      content: content.trim(),
      linkedVerses,
      type: 'reflection',
    });
    setContent('');
    setLinkedVerses([]);
    onSaved?.();
  };

  const addLinkedVerse = () => {
    if (pickerBook && pickerChapter && pickerVerse) {
      const verseId = `${pickerBook}.${pickerChapter}.${pickerVerse}`;
      if (!linkedVerses.includes(verseId)) {
        setLinkedVerses(prev => [...prev, verseId]);
      }
      setPickerBook('');
      setPickerChapter('');
      setPickerVerse('');
      setShowVersePicker(false);
    }
  };

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-apple-600">New Entry</h3>
        <span className="text-xs text-apple-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <TextArea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What is God teaching you today? What verses stood out? How are you being shaped?"
        rows={5}
      />

      {linkedVerses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {linkedVerses.map(v => (
            <Badge
              key={v}
              color="#007AFF"
              onRemove={() => setLinkedVerses(prev => prev.filter(x => x !== v))}
            >
              {formatVerseRef(v)}
            </Badge>
          ))}
        </div>
      )}

      {showVersePicker ? (
        <div className="flex items-end gap-2 p-3 rounded-xl bg-apple-50">
          <div className="flex-1">
            <label className="text-xs text-apple-500 mb-1 block">Book</label>
            <select
              value={pickerBook}
              onChange={e => setPickerBook(e.target.value)}
              className="w-full text-sm rounded-lg border border-white/30 bg-white px-2 py-1.5 text-apple-700 focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="">Select</option>
              {BIBLE_BOOKS.map(b => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="w-16">
            <label className="text-xs text-apple-500 mb-1 block">Ch.</label>
            <input
              type="number"
              min={1}
              value={pickerChapter}
              onChange={e => setPickerChapter(e.target.value)}
              className="w-full text-sm rounded-lg border border-white/30 bg-white px-2 py-1.5 text-apple-700 focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div className="w-16">
            <label className="text-xs text-apple-500 mb-1 block">Vs.</label>
            <input
              type="number"
              min={1}
              value={pickerVerse}
              onChange={e => setPickerVerse(e.target.value)}
              className="w-full text-sm rounded-lg border border-white/30 bg-white px-2 py-1.5 text-apple-700 focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <Button size="sm" onClick={addLinkedVerse}>Add</Button>
          <button onClick={() => setShowVersePicker(false)} className="p-1.5 text-apple-400">
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowVersePicker(true)}
          className="flex items-center gap-1.5 text-xs text-accent font-medium hover:opacity-80 transition-opacity"
        >
          <BookOpen size={14} />
          Link a verse
        </button>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!content.trim()}>
          Save Entry
        </Button>
      </div>
    </GlassCard>
  );
}
