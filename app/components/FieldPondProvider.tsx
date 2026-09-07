'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { StudyConnection, StudyEssay } from '../pond-studies/studyContent';

type FieldPondContextValue = {
  essays: StudyEssay[];
  connections: StudyConnection[];
  selected: StudyEssay | null;
  hasFound: boolean;
  /** Explicit atlas selections cancel an unfinished hero discovery. */
  selectionRevision: number;
  selectEssay: (slug: string) => void;
  discover: () => void;
};

const FieldPondContext = createContext<FieldPondContextValue | null>(null);

export function FieldPondProvider({ essays, connections, children }: {
  essays: StudyEssay[];
  connections: StudyConnection[];
  children: ReactNode;
}) {
  const [selection, setSelection] = useState({ slug: essays[0]?.slug ?? '', hasFound: false, revision: 0 });
  const selected = essays.find(essay => essay.slug === selection.slug) ?? essays[0] ?? null;
  const selectEssay = useCallback((slug: string) => {
    if (!essays.some(essay => essay.slug === slug)) return;
    setSelection(current => ({ slug, hasFound: true, revision: current.revision + 1 }));
  }, [essays]);
  const discover = useCallback(() => {
    if (!essays.length) return;
    setSelection(current => {
      const index = Math.max(0, essays.findIndex(essay => essay.slug === current.slug));
      return { ...current, slug: essays[(index + 1) % essays.length].slug, hasFound: true };
    });
  }, [essays]);
  const value = useMemo(() => ({
    essays, connections, selected, hasFound: selection.hasFound,
    selectionRevision: selection.revision, selectEssay, discover,
  }), [essays, connections, selected, selection.hasFound, selection.revision, selectEssay, discover]);
  return <FieldPondContext.Provider value={value}>{children}</FieldPondContext.Provider>;
}

export function useFieldPond() {
  const value = useContext(FieldPondContext);
  if (!value) throw new Error('useFieldPond must be used inside FieldPondProvider');
  return value;
}
