'use client';

import { useEffect, useRef, useState } from 'react';

/** The code is already highlighted on the server; only copying needs JavaScript. */
export function CopyCodeButton({ code }: { code: string }) {
  const [label, setLabel] = useState('Copy');
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; if (reset.current) clearTimeout(reset.current); };
  }, []);
  const copy = async () => {
    let result = 'Copied!';
    try { await navigator.clipboard.writeText(code); }
    catch { result = 'Copy unavailable'; }
    if (!mounted.current) return;
    if (reset.current) clearTimeout(reset.current);
    setLabel(result);
    reset.current = setTimeout(() => setLabel('Copy'), 2000);
  };
  return <button className="code-action" type="button" onClick={copy} aria-label="Copy code"><span aria-live="polite">{label}</span></button>;
}
