// app/api/auth/magic/request/route.ts
import { checkRateLimit } from '@/lib/redis/rateLimit'
import { storeMagicLinkSession } from '@/lib/redis/session'
import { createHash, randomBytes } from 'crypto'
import { SignJWT } from 'jose'
import { getTranslations } from 'next-intl/server'
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const JWT_SECRET = new TextEncoder().encode(process.env.MAGIC_JWT_SECRET)

function getAppUrl(req: NextRequest): string {
    // x-forwarded-* headers: proxy/load balancer mögött
    const proto = req.headers.get('x-forwarded-proto')
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
    if (proto && host) return `${proto}://${host.split(',')[0].trim()}`
    // Fallback: req.url-ből (Next.js beállítja)
    return new URL(req.url).origin
}

export async function POST(req: NextRequest) {
    const { email, redirectTo, locale } = await req.json()
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    const appUrl = getAppUrl(req)

    // Rate limit per IP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const rateLimitOk = await checkRateLimit(`ml:${ip}`)

    if (!rateLimitOk) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    // Generate single-use nonce + short code (opcionális)
    const nonce = randomBytes(16).toString('hex')
    const code = randomBytes(3).toString('hex') // 6 hex char (kényelmi debug/UX)
    const digest = createHash('sha256').update(`${email}:${code}`).digest('hex')

    // Store in Redis (60 perc)

    try {
        await storeMagicLinkSession(nonce, { digest, email }, 60 * 60)
    } catch (error) {
        console.error('Error storing magic link session:', error)
        return NextResponse.json({ error: 'Failed to store magic link session' }, { status: 500 })
    }

    // Create compact JWT to avoid very long URLs
    const jwt = await new SignJWT({ n: nonce })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuer('magic')
        .setAudience('web')
        .setExpirationTime('60m')
        .sign(JWT_SECRET)

    const url = new URL('/api/auth/magic/consume', appUrl)
    url.searchParams.set('token', jwt)
    if (redirectTo) url.searchParams.set('next', redirectTo)

    url.searchParams.set('next', '/account')
    // Send email
    try {
        // Get translations - using default locale 'en' for emails
        const t = await getTranslations({ locale: locale, namespace: 'Email' })

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST!,
            port: Number(process.env.SMTP_PORT!),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
        })

        await transporter.sendMail({
            from: process.env.SMTP_USER!,
            to: email,
            subject: t('magic_link.subject'),
            text: `${t('magic_link.greeting')}

${t('magic_link.intro')} 

${t('magic_link.instruction')}
${url.toString()}

${t('magic_link.expires')}

${t('magic_link.ignore')}

${t('magic_link.signature')}
`,

            html: `
      <div style="max-width:460px;margin:0 auto;border-radius:8px;border:1px solid #eaeaea;padding:28px 22px 22px;font-family:'Segoe UI',Arial,sans-serif;background:#fafcff;color:#23272f;">
        <div style="text-align:center;margin-bottom:24px;">
          <img src="${appUrl}/logo-small.webp" alt="Logo" style="width:54px;height:auto;margin-bottom:8px;border-radius:8px;" />
        </div>
        <h2 style="text-align:center;margin:0 0 18px 0;font-weight:600;font-size:1.45rem;letter-spacing:-0.01em;">${t('magic_link.html.title')}</h2>
        <p style="margin:0 0 19px 0;font-size:1.05rem;">
          ${t('magic_link.html.description')}
        </p>
        <div style="text-align:center;margin:32px 0 24px 0;">
          <a href="${url.toString()}" style="display:inline-block;padding:14px 32px;background:#3438b7;color:#fff!important;text-decoration:none;font-size:1.08rem;font-weight:600;border-radius:6px;box-shadow:0 2px 8px rgba(52,56,183,.04);">
            ${t('magic_link.html.button_text')}
          </a>
        </div>
        <p style="font-size:0.98rem;color:#545770;margin:0 0 18px 0;">
          ${t('magic_link.html.or_copy_paste')}<br>
          <a href="${url.toString()}" style="color:#3438b7;word-break:break-all;">${url.toString()}</a>
        </p>
        <p style="font-size:0.97rem;color:#545770;margin:14px 0 6px;">${t('magic_link.html.expires_text')}<br>
          ${t('magic_link.html.ignore_text')}
        </p>
        <hr style="margin:24px 0 14px;border:none;border-top:1px solid #eaeaea;">
        <div style="color:#b0b2ba;font-size:0.95rem;text-align:center;">
          ${t('magic_link.html.sent_by')} <strong>${t('magic_link.html.team_name')}</strong>
        </div>
      </div>
    `,
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Error sending email:', error)
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }
}
