import { JournalEditor } from '../components/journal/JournalEditor';
import { JournalList } from '../components/journal/JournalList';
import { MoodSelector } from '../components/tracking/MoodSelector';

export function JournalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Journal</h1>
        <p className="text-sm text-apple-500 mt-1">
          Record what God is teaching you.
        </p>
      </div>

      <MoodSelector type="before" />

      <JournalEditor />

      <div className="border-t border-white/30 pt-6">
        <h2 className="text-sm font-semibold text-apple-500 uppercase tracking-wider mb-3">
          Past Entries
        </h2>
        <JournalList />
      </div>
    </div>
  );
}
