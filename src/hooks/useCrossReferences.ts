import { useState, useCallback } from 'react';

let crossRefCache: Record<string, string[]> | null = null;
let loadPromise: Promise<void> | null = null;

async function loadCrossRefs(): Promise<Record<string, string[]>> {
  if (crossRefCache) return crossRefCache;
  if (loadPromise) {
    await loadPromise;
    return crossRefCache!;
  }

  loadPromise = fetch('/bible/cross-references.json')
    .then(res => res.json())
    .then(data => {
      crossRefCache = data;
    })
    .catch(() => {
      crossRefCache = {};
    });

  await loadPromise;
  return crossRefCache!;
}

export function useCrossReferences() {
  const [refs, setRefs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCrossRefs = useCallback(async (verseId: string) => {
    setIsLoading(true);
    const data = await loadCrossRefs();
    setRefs(data[verseId] || []);
    setIsLoading(false);
  }, []);

  return { refs, isLoading, getCrossRefs };
}
