'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-async-light';
import oneLight from 'react-syntax-highlighter/dist/esm/styles/prism/one-light';
import type { WorkshopItem } from '../config/workshopConfig';
import { getCodeToolsLanguageLabel, normalizeCodeToolsLanguage } from '../utils/codeTools';

export default function ToolSnippetPreview({ item, onCopy, copyLabel }: { item: WorkshopItem; onCopy: () => void; copyLabel: string }) {
  return (
    <>
      {item.writeup && <div className="item-writeup sticky-note p-5"><ReactMarkdown remarkPlugins={[remarkGfm]}>{item.writeup}</ReactMarkdown></div>}
    <div className="sticky-note overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="space-y-0.5">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            {getCodeToolsLanguageLabel(item.language)}
          </p>
          <p className="font-body text-sm text-secondary">
            {item.filename || 'Inline snippet'}
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {item.gistUrl && (
            <a
              href={item.gistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-surface-container-low px-3 py-1.5 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-secondary-container hover:text-primary"
            >
              Gist
            </a>
          )}
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center justify-center rounded-full bg-surface-container-low px-3 py-1.5 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-secondary-container hover:text-primary"
          >
            {copyLabel}
          </button>
        </div>
      </div>

      <div>
        <SyntaxHighlighter
          language={normalizeCodeToolsLanguage(item.language)}
          style={oneLight}
          showLineNumbers
          wrapLines
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            textAlign: 'right',
            userSelect: 'none',
            opacity: 0.45,
          }}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.88rem',
            lineHeight: '1.7',
            background: 'transparent',
          }}
          codeTagProps={{
            style: {
              fontFamily: "'IBM Plex Mono', 'Consolas', 'Monaco', monospace",
            },
          }}
        >
          {item.content}
        </SyntaxHighlighter>
      </div>
    </div>
    </>
  );
}
