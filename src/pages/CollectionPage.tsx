import { useState } from 'react';
import { ChangedMeList } from '../components/collection/ChangedMeList';
import { TagManager } from '../components/tags/TagManager';
import { TaggedVerseList } from '../components/tags/TaggedVerseList';

type Tab = 'changed' | 'tags';

export function CollectionPage() {
  const [tab, setTab] = useState<Tab>('changed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Collection</h1>
        <p className="text-sm text-apple-500 mt-1">
          Verses and themes that shape your journey.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('changed')}
          className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
            tab === 'changed' ? 'btn-gradient text-white' : 'glass text-apple-600 hover:bg-white/60'
          }`}
        >
          Verses That Changed Me
        </button>
        <button
          onClick={() => setTab('tags')}
          className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
            tab === 'tags' ? 'btn-gradient text-white' : 'glass text-apple-600 hover:bg-white/60'
          }`}
        >
          Tags
        </button>
      </div>

      {tab === 'changed' && <ChangedMeList />}
      {tab === 'tags' && (
        <div className="space-y-6">
          <TagManager />
          <TaggedVerseList />
        </div>
      )}
    </div>
  );
}
