import { useState } from 'react';
import { OT_BOOKS, NT_BOOKS } from '../../lib/bible';
import { useScriptureStore } from '../../stores/useScriptureStore';
import { Search } from 'lucide-react';

export function BookSelector() {
  const [search, setSearch] = useState('');
  const setBook = useScriptureStore(s => s.setBook);

  const filterBooks = (books: typeof OT_BOOKS) =>
    books.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  const filteredOT = filterBooks(OT_BOOKS);
  const filteredNT = filterBooks(NT_BOOKS);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-400" />
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-white/40 bg-white/40 backdrop-blur-sm pl-10 pr-4 py-2.5 text-sm text-apple-900 placeholder:text-apple-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-xs font-semibold text-apple-500 uppercase tracking-wider mb-3">
            Old Testament
          </h3>
          <div className="space-y-0.5">
            {filteredOT.map(book => (
              <button
                key={book.name}
                onClick={() => setBook(book.name)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-apple-700 hover:bg-accent/5 transition-colors"
              >
                {book.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-apple-500 uppercase tracking-wider mb-3">
            New Testament
          </h3>
          <div className="space-y-0.5">
            {filteredNT.map(book => (
              <button
                key={book.name}
                onClick={() => setBook(book.name)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-apple-700 hover:bg-accent/5 transition-colors"
              >
                {book.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
