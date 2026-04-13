import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/subscribe
 *
 * Accepts { email } and forwards it to a Google Apps Script web app
 * that appends the email + timestamp to a Google Sheet.
 *
 * The GOOGLE_APPS_SCRIPT_URL env var should point to the deployed
 * Apps Script web app URL (see docs/plans/subscribe-setup.md).
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      // If no Apps Script URL configured, log and return success anyway
      // so the form still works during development
      console.log('[subscribe] No GOOGLE_APPS_SCRIPT_URL configured. Email:', email);
      return NextResponse.json({ success: true, message: 'Subscribed (dev mode)' });
    }

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, timestamp: new Date().toISOString() }),
    });

    if (!response.ok) {
      console.error('[subscribe] Apps Script error:', response.status);
      return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Subscribed' });
  } catch (error) {
    console.error('[subscribe] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
