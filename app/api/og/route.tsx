import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters
    const title = searchParams.get('title') || 'Economic Notes';
    const date = searchParams.get('date');
    const tags = searchParams.get('tags');
    const summary = searchParams.get('summary');

    // Parse date if provided
    const dateObj = date ? new Date(date) : null;
    const formattedDate = dateObj
      ? dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';

    // Parse tags if provided
    const tagList = tags ? tags.split(',').filter(Boolean) : [];

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0a0a0a',
            padding: '60px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Background gradient */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, #0070f3 0%, #0050a3 100%)',
              opacity: 0.1,
            }}
          />

          {/* Top section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Blog name */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '24px',
                fontWeight: 600,
                color: '#0070f3',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0070f3 0%, #0050a3 100%)',
                }}
              />
              Economic Notes
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 700,
                color: 'white',
                lineHeight: 1.1,
                maxWidth: '90%',
                marginTop: '20px',
              }}
            >
              {title}
            </h1>

            {/* Summary */}
            {summary && (
              <p
                style={{
                  fontSize: '24px',
                  color: '#a1a1a1',
                  lineHeight: 1.4,
                  maxWidth: '80%',
                }}
              >
                {summary}
              </p>
            )}
          </div>

          {/* Bottom section */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              width: '100%',
            }}
          >
            {/* Tags */}
            {tagList.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {tagList.slice(0, 4).map((tag, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      backgroundColor: 'rgba(0, 112, 243, 0.2)',
                      color: '#0070f3',
                      fontSize: '18px',
                      fontWeight: 500,
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {/* Date and domain */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '8px',
              }}
            >
              {formattedDate && (
                <div style={{ color: '#a1a1a1', fontSize: '20px' }}>
                  {formattedDate}
                </div>
              )}
              <div style={{ color: '#0070f3', fontSize: '20px', fontWeight: 600 }}>
                econoben.dev
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}