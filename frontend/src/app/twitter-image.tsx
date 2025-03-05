import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export default async function TwitterImage() {
  try {
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
            backgroundColor: '#fff',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #f0f0f0 2%, transparent 0%), radial-gradient(circle at 75px 75px, #f0f0f0 2%, transparent 0%)',
            backgroundSize: '100px 100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '20px',
              padding: '40px 60px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              maxWidth: '80%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '20px',
                }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'black',
                  margin: '0',
                }}
              >
                justlive.chat
              </h1>
            </div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 'normal',
                color: 'black',
                margin: '0 0 20px 0',
                textAlign: 'center',
              }}
            >
              Free Live Chat for Your Website
            </h2>
            <p
              style={{
                fontSize: '20px',
                color: 'rgba(0, 0, 0, 0.7)',
                margin: '0',
                textAlign: 'center',
                maxWidth: '600px',
              }}
            >
              Connect with your visitors in real-time. Beautiful, unbranded, and completely free.
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
} 