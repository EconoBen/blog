import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ECONOBEN.DEV — AI/ML Engineering & Writing';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const [spaceGrotesk, inter] = await Promise.all([
    fetch(
      new URL('https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2')
    ).then((res) => res.arrayBuffer()),
    fetch(
      new URL('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.woff2')
    ).then((res) => res.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#fef9ef',
          fontFamily: 'Inter',
        }}
      >
        {/* Left content */}
        <div
          style={{
            flex: 1,
            padding: '80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#0035a0',
            }}
          >
            AI/ML Engineering & Writing
          </div>
          <div
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: 72,
              fontWeight: 900,
              color: '#1d1c16',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              marginTop: 16,
            }}
          >
            ECONOBEN
            <br />
            .DEV
          </div>
          <div
            style={{
              fontSize: 22,
              color: '#555f70',
              lineHeight: 1.5,
              marginTop: 20,
              maxWidth: 500,
            }}
          >
            Posts, talks, publications, and the work surrounding my upcoming
            O'Reilly book on AI agent memory.
          </div>
          <div
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: 16,
              fontWeight: 700,
              color: '#0035a0',
              marginTop: 'auto',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            econoben.dev
          </div>
        </div>

        {/* Right panel */}
        <div
          style={{
            width: 400,
            background: '#0035a0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              color: '#fff',
              textAlign: 'center',
              padding: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'Space Grotesk',
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: '0.05em',
              }}
            >
              STAFF AI/ML
              <br />
              ENGINEER
            </div>
            <div
              style={{
                fontSize: 14,
                opacity: 0.7,
                marginTop: 12,
                lineHeight: 1.5,
              }}
            >
              Writer · Speaker
              <br />
              O'Reilly Author
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Space Grotesk', data: spaceGrotesk, style: 'normal', weight: 900 },
        { name: 'Inter', data: inter, style: 'normal', weight: 400 },
      ],
    }
  );
}
