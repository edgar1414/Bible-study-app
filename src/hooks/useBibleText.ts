import { useState, useEffect } from 'react';
import type { BibleBook } from '../types/bible';

const bookCache = new Map<string, BibleBook>();

export function useBibleText(bookName: string | null) {
  const [book, setBook] = useState<BibleBook | null>(
    bookName ? bookCache.get(bookName) ?? null : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookName) {
      setBook(null);
      return;
    }

    const cached = bookCache.get(bookName);
    if (cached) {
      setBook(cached);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/bible/${bookName}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load ${bookName}`);
        return res.json();
      })
      .then((data: BibleBook) => {
        if (cancelled) return;
        bookCache.set(bookName, data);
        setBook(data);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [bookName]);

  return { book, loading, error };
}
