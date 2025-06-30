import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Get parameters from URL
    const title = searchParams.get('title')?.slice(0, 100) ?? 'Ben Labaschin Blog';
    const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0];
    const tags = searchParams.get('tags')?.split(',').slice(0, 3) ?? [];
    const summary = searchParams.get('summary')?.slice(0, 150) ?? '';
    
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
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '60px',
          }}
        >
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            {/* Title */}
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                margin: 0,
                marginBottom: '20px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {title}
            </h1>
            
            {/* Summary if provided */}
            {summary && (
              <p
                style={{
                  fontSize: '32px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: 1.4,
                  margin: 0,
                  maxWidth: '900px',
                }}
              >
                {summary}
              </p>
            )}
            
            {/* Tags */}
            {tags.length > 0 && (
              <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '30px',
                      fontSize: '24px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginTop: '40px',
            }}
          >
            {/* Author and Site */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Author Avatar Circle */}
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: '#667eea',
                }}
              >
                BL
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  Ben Labaschin
                </span>
                <span
                  style={{
                    fontSize: '24px',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  labasc.blog
                </span>
              </div>
            </div>
            
            {/* Date */}
            <span
              style={{
                fontSize: '28px',
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              {new Date(date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
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