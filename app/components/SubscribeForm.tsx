'use client';

import { useState } from 'react';

interface SubscribeFormProps {
  variant?: 'dark' | 'light';
}

export function SubscribeForm({ variant = 'dark' }: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return variant === 'dark' ? (
      <div className="rounded-2xl bg-[#0035a0] p-8 text-white md:p-12">
        <h3 className="font-headline text-2xl font-bold">You&rsquo;re on the list.</h3>
        <p className="mt-3 max-w-md font-body text-base leading-relaxed text-white/80">
          You&rsquo;ll hear about new writing, talks, and book progress. No spam.
        </p>
      </div>
    ) : (
      <div>
        <h3 className="font-headline text-2xl font-bold text-[#1d1c16]">You&rsquo;re on the list.</h3>
        <p className="mt-3 max-w-md font-body text-base leading-relaxed text-[#1d1c16]/70">
          You&rsquo;ll hear about new writing, talks, and book progress. No spam.
        </p>
      </div>
    );
  }

  if (variant === 'light') {
    return (
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#0035a0]">
            Stay in the loop
          </p>
          <h2 className="font-headline text-3xl font-black tracking-tight text-[#1d1c16] md:text-4xl">
            Get updates on new posts, talks, and book progress
          </h2>
          <p className="max-w-lg text-lg leading-relaxed text-[#1d1c16]/70">
            No spam &mdash; just updates when something new ships or the book hits a milestone.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:items-center md:justify-center">
          <div className="flex w-full gap-3">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-[#0035a0]/15 bg-white/80 px-4 py-3 font-body text-sm text-[#1d1c16] placeholder:text-[#1d1c16]/30 shadow-[0_4px_12px_rgba(0,53,160,0.06)] focus:border-[#0035a0]/30 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="shrink-0 rounded-lg bg-[#0035a0] px-6 py-3 font-label text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ color: '#fff', WebkitTextFillColor: '#fff' }}
            >
              {status === 'loading' ? 'Sending...' : 'Subscribe'}
            </button>
          </div>
          {status === 'error' && (
            <p className="font-body text-sm text-[#1d1c16]/50">Something went wrong. Try emailing agentmemory@econoben.dev directly.</p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#0035a0] p-8 md:p-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
        <div className="text-white">
          <h3 className="font-headline text-2xl font-bold md:text-3xl">Get notified when Agent Memory ships.</h3>
          <p className="mt-2 max-w-md font-body text-base leading-relaxed text-white/80">
            No spam, no fake waitlist. Just an email when the book is ready.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-3 md:w-auto">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-w-0 flex-1 rounded-lg bg-white/10 px-4 py-3 font-body text-sm text-white placeholder:text-white/40 focus:bg-white/15 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="shrink-0 rounded-lg bg-white px-6 py-3 font-label text-[11px] font-bold uppercase tracking-widest text-[#0035a0] transition-all hover:-translate-y-0.5 disabled:opacity-60"
          >
            {status === 'loading' ? 'Sending...' : 'Subscribe'}
          </button>
        </form>
      </div>
      {status === 'error' && (
        <p className="mt-4 font-body text-sm text-white/70">Something went wrong. Try emailing agentmemory@econoben.dev directly.</p>
      )}
    </div>
  );
}
