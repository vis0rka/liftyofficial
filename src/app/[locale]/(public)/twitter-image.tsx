import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Lifty Official'

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0f172a 0%, #334155 50%, #0f172a 100%)',
                    color: 'white',
                    fontSize: 64,
                    fontWeight: 700,
                    letterSpacing: -1,
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
                    <div style={{ fontSize: 84 }}>Lifty</div>
                    <div style={{ fontSize: 30, opacity: 0.85 }}>Premium toddler hip carrier</div>
                    <div style={{ fontSize: 22, opacity: 0.7 }}>/{locale}</div>
                </div>
            </div>
        ),
        size,
    )
}
