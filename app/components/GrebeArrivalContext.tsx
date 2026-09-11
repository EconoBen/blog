'use client';

import { createContext, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

type GrebeArrivalContextValue = {
  opening: boolean;
  setOpening: Dispatch<SetStateAction<boolean>>;
};

// Routes without an arrival provider keep their existing immediate swimmers.
const GrebeArrivalContext = createContext<GrebeArrivalContextValue>({
  opening: false,
  setOpening: () => {},
});

export function GrebeArrivalProvider({ children }: { children: ReactNode }) {
  const [opening, setOpening] = useState(true);
  const value = useMemo(() => ({ opening, setOpening }), [opening]);
  return <GrebeArrivalContext.Provider value={value}>{children}</GrebeArrivalContext.Provider>;
}

export function useGrebeArrivalContext() {
  return useContext(GrebeArrivalContext);
}
