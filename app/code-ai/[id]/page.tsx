import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { EditorialPageFrame } from '../../components/EditorialPageFrame';
import { getSiteUrl } from '../../utils/siteUrl';
import {
  formatCodeToolsDate,
  getCodeToolsCategoryMeta,
  getCodeToolsItemById,
  getCodeToolsItemLineCount,
  getCodeToolsLanguageLabel,
  getCodeToolsRelatedItems,
  getCodeToolsStaticParams,
  getCodeToolsUrl,
  normalizeCodeToolsLanguage,
} from '../../utils/codeTools';

const codeBlockStyle = {
  background: 'rgba(246, 242, 233, 0.94)',
  border: '1px solid rgba(16, 34, 54, 0.08)',
  borderRadius: '18px',
  boxShadow: '0 16px 32px rgba(24, 36, 49, 0.08)',
  overflow: 'hidden',
} as const;

const syntaxStyle = {
  margin: 0,
  padding: '1rem',
  fontSize: '0.9rem',
  lineHeight: '1.72',
  background: 'transparent',
} as const;

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`.trim()} aria-hidden="true">
      {name}
    </span>
  );
}

function DetailStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <span className="block font-headline text-lg font-bold text-[#1d1c16] sm:text-xl">{value}</span>
      <span className="mt-1 block font-label text-[9px] font-bold uppercase tracking-widest text-[#555f70] sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

function SidebarBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl bg-[#f8f3e9] p-6">
      <h3 className="mb-4 font-headline text-sm font-bold uppercase tracking-widest text-[#555f70]">
        {title}
      </h3>
      {children}
    </section>
  );
}

export async function generateStaticParams() {
  return getCodeToolsStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = getCodeToolsItemById(id);

  if (!item) {
    return {
      title: 'Not Found | Code & Tools',
    };
  }

  const canonicalUrl = `${getSiteUrl()}${getCodeToolsUrl(id)}`;

  return {
    title: `${item.title} | Code & Tools | ECONOBEN.DEV`,
    description: item.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: item.title,
      description: item.description,
      type: 'article',
      url: canonicalUrl,
      publishedTime: item.date ? new Date(item.date).toISOString() : undefined,
      tags: item.tags,
    },
  };
}

export default async function CodeAIDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getCodeToolsItemById(id);

  if (!item) {
    notFound();
  }

  const categoryConfig = getCodeToolsCategoryMeta(item.category);
  const relatedItems = getCodeToolsRelatedItems(item, 3);
  const lineCount = getCodeToolsItemLineCount(item);
  const dateLabel = item.date
    ? formatCodeToolsDate(item.date, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Undated';
  const languageLabel = getCodeToolsLanguageLabel(item.language);

  return (
    <EditorialPageFrame currentPath="/code-ai" pageClassName="editorial-book-page">
      <main className="mx-auto max-w-7xl px-8 py-14 sm:py-16">
        <section className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="order-1 lg:col-span-8 lg:order-2">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-sm bg-[#bdc7db] px-3 py-1 font-label text-xs font-bold uppercase tracking-widest text-[#121c2b]">
                {categoryConfig?.label || item.category}
              </span>
              <span className="font-label text-sm italic text-[#555f70]">{dateLabel}</span>
            </div>
            <h1 className="mb-5 max-w-3xl font-headline text-3xl font-extrabold tracking-tight text-[#1d1c16] sm:text-5xl lg:text-6xl">
              {item.title}
            </h1>
            <p className="max-w-2xl font-body text-base italic leading-relaxed text-[#434655] sm:text-xl">
              {item.description}
            </p>
            <p className="mt-5 max-w-3xl font-body text-sm leading-relaxed text-[#555f70] sm:text-lg">
              Each entry keeps the writeup and source together, so the page reads like a clipped
              page from the archive rather than a detached utility screen.
            </p>
          </div>

          <div className="order-2 flex flex-col justify-end lg:col-span-4 lg:order-1">
            <div className="space-y-4 rounded-xl bg-[#f8f3e9] p-4 sm:p-7">
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                <DetailStat label="Language" value={languageLabel} />
                <DetailStat label="Lines" value={lineCount} />
                <DetailStat label="Tags" value={item.tags.length} />
                <DetailStat label="Related" value={relatedItems.length} />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/code-ai"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#c3c6d7] px-4 py-3 font-headline text-sm font-bold text-[#1d1c16] transition-colors hover:bg-white sm:flex-1"
                >
                  <MaterialIcon name="arrow_back" className="text-sm" />
                  Back to Code &amp; Tools
                </Link>
                {item.gistUrl && (
                  <a
                    href={item.gistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-4 py-3 font-headline text-sm font-bold text-white transition-opacity hover:opacity-90 sm:flex-1"
                  >
                    <MaterialIcon name="terminal" className="text-sm" />
                    View on GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <aside className="order-2 space-y-5 lg:col-span-3 lg:order-1">
            <SidebarBlock title="Overview">
              <ul className="space-y-2.5 font-label text-sm text-[#1d1c16]">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#004ac6]" />
                  {categoryConfig?.label || item.category}
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#004ac6]" />
                  {languageLabel}
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#004ac6]" />
                  {dateLabel}
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#004ac6]" />
                  {lineCount} lines
                </li>
              </ul>
            </SidebarBlock>

            <SidebarBlock title="Source">
              <div className="rounded-lg bg-[#e7e2d8] p-4 font-mono text-xs text-[#434655]">
                <div>{item.filename || 'Inline snippet'}</div>
                <div className="mt-2 break-all">{getCodeToolsUrl(item.id)}</div>
              </div>
            </SidebarBlock>

            <SidebarBlock title="Tags">
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#555f70]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </SidebarBlock>

            <SidebarBlock title="Archive note">
              <p className="font-body text-sm leading-relaxed text-[#434655]">
                The archive keeps the narrative, notes, and source in one place, which makes each
                item feel like a preserved page instead of a separate tool.
              </p>
            </SidebarBlock>
          </aside>

          <div className="order-1 space-y-8 lg:col-span-9 lg:order-2">
            <article>
              <h2 className="mb-4 font-headline text-2xl font-bold text-[#1d1c16] sm:text-3xl">
                The implementation
              </h2>
              <p className="mb-6 max-w-3xl font-body text-base leading-relaxed text-[#434655] sm:text-lg">
                The detail page preserves the practical behavior of the original route: the writeup
                stays readable, the source remains copyable and syntax highlighted, and the item can
                still link back into the rest of the catalog.
              </p>

              {item.writeup && (
                <div className="mb-8 rounded-xl bg-white/70 p-6 shadow-[0_16px_32px_rgba(24,36,49,0.08)] sm:p-8">
                  <div className="item-writeup">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.writeup}</ReactMarkdown>
                  </div>
                </div>
              )}

              <div style={codeBlockStyle}>
                <div className="flex items-center justify-between border-b border-[#d7d0c4] bg-[#f8f3e9] px-6 py-3">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                    <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#737686]">
                    {item.filename || item.id}
                  </span>
                </div>
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
                  customStyle={syntaxStyle}
                  codeTagProps={{
                    style: {
                      fontFamily:
                        "'IBM Plex Mono', 'Roboto Mono', 'Consolas', 'Monaco', monospace",
                    },
                  }}
                >
                  {item.content}
                </SyntaxHighlighter>
              </div>
            </article>

            {relatedItems.length > 0 && (
              <section className="mt-24 border-t border-[#1d1c16]/5 pt-12 sm:mt-32 sm:pt-16">
                <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="mb-2 font-headline text-xs font-black uppercase tracking-widest text-[#555f70]">
                      More from the lab
                    </h3>
                    <h2 className="font-headline text-2xl font-bold text-[#1d1c16] sm:text-3xl">
                      Related utilities
                    </h2>
                  </div>
                  <Link
                    href="/code-ai"
                    className="inline-flex items-center gap-1 font-headline font-bold text-[#004ac6] hover:underline"
                  >
                    View full catalog
                    <MaterialIcon name="arrow_forward" className="text-sm" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                  {relatedItems.map((relatedItem) => (
                    <Link
                      key={relatedItem.id}
                      href={getCodeToolsUrl(relatedItem.id)}
                      className="rounded-xl bg-[#e7e2d8] p-6 transition-all hover:-translate-y-1 sm:p-8"
                    >
                      <div className="mb-4 text-xs font-label font-bold uppercase tracking-widest text-[#004ac6]">
                        {getCodeToolsCategoryMeta(relatedItem.category)?.label || relatedItem.category}
                      </div>
                      <h4 className="mb-2 font-headline text-xl font-bold text-[#1d1c16]">
                        {relatedItem.title}
                      </h4>
                      <p className="mb-6 font-body text-sm text-[#434655]">
                        {relatedItem.description}
                      </p>
                      <div className="flex items-center gap-4 font-label text-xs font-bold text-[#555f70]">
                        <span className="flex items-center gap-1">
                          <MaterialIcon name="code" className="text-xs" />
                          {getCodeToolsLanguageLabel(relatedItem.language)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MaterialIcon name="history" className="text-xs" />
                          {relatedItem.date ? formatCodeToolsDate(relatedItem.date) : 'Undated'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>
      </main>
    </EditorialPageFrame>
  );
}
