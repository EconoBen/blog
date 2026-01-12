import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Economic Notes';
    const description = searchParams.get('description') || 'Exploring Economics, Technology, and Life';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            backgroundImage: 'linear-gradient(45deg, #f0f9ff 0%, #e0f2fe 100%)',
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              maxWidth: '800px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: '#0066cc',
                marginBottom: '20px',
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 24,
                color: '#374151',
                lineHeight: 1.4,
                maxWidth: '600px',
              }}
            >
              {description}
            </div>
            <div
              style={{
                marginTop: '40px',
                fontSize: 18,
                color: '#6b7280',
                fontWeight: 500,
              }}
            >
              econoben.dev
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