import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/subscribe
 *
 * Accepts { email } and forwards it to a Google Apps Script web app
 * that appends the email + timestamp to a Google Sheet.
 *
 * Google Apps Script web apps return a 302 redirect on POST.
 * The redirect target returns the actual JSON response. We need to
 * follow the redirect manually as a GET to retrieve the response,
 * but the data is already written by the time the redirect happens.
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      console.log('[subscribe] No GOOGLE_APPS_SCRIPT_URL configured. Email:', email);
      return NextResponse.json({ success: true, message: 'Subscribed (dev mode)' });
    }

    // POST to Apps Script — it will 302 redirect after processing.
    // We set redirect: 'manual' so we can handle it ourselves.
    // The data is written when the 302 is returned, so a redirect = success.
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, timestamp: new Date().toISOString() }),
      redirect: 'manual',
    });

    // 302 means the script executed and redirected — that's success
    if (response.status === 302 || response.status === 200) {
      return NextResponse.json({ success: true, message: 'Subscribed' });
    }

    // Try to follow the redirect to get the actual response
    const location = response.headers.get('location');
    if (location) {
      const followUp = await fetch(location);
      if (followUp.ok) {
        return NextResponse.json({ success: true, message: 'Subscribed' });
      }
    }

    console.error('[subscribe] Unexpected response:', response.status);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  } catch (error) {
    console.error('[subscribe] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
