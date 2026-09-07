import { NextRequest, NextResponse } from 'next/server';

/** Confirm the Apps Script JSON result, including its one-time output redirect. */
export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  const email = typeof body === 'object' && body !== null && 'email' in body && typeof body.email === 'string' ? body.email.trim() : '';
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
  }
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptUrl) {
    return NextResponse.json({ error: 'Email signup is temporarily unavailable' }, { status: 503 });
  }
  try {
    const signal = AbortSignal.timeout(10_000);
    let response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, timestamp: new Date().toISOString() }),
      redirect: 'manual',
      signal,
    });
    if (response.status === 302 || response.status === 303) {
      const location = response.headers.get('location');
      if (!location) throw new Error('Missing subscription result');
      const output = new URL(location, scriptUrl);
      if (output.protocol !== 'https:' || !['script.googleusercontent.com', 'script.google.com'].includes(output.hostname)) {
        throw new Error('Unexpected subscription output');
      }
      // The POST may already have written a row. Retrieve its result; do not POST again.
      response = await fetch(output.toString(), { method: 'GET', redirect: 'error', signal });
    }
    if (!response.ok) throw new Error('Subscription service unavailable');
    const result = await response.json();
    // This is the contract documented in docs/plans/subscribe-setup.md.
    if (result?.status !== 'success' && result?.status !== 'already_subscribed') {
      throw new Error('Subscription was not confirmed');
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'We could not confirm your signup. Please try again.' }, { status: 502 });
  }
}
