// app/api/auth/magic/request/route.ts
import { checkRateLimit } from '@/lib/redis/rateLimit'
import { storeMagicLinkSession } from '@/lib/redis/session'
import { createHash, randomBytes } from 'crypto'
import { SignJWT } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const JWT_SECRET = new TextEncoder().encode(process.env.MAGIC_JWT_SECRET)
const APP_URL = process.env.APP_URL ?? 'http://localhost:3000' // pl. https://example.com

export async function POST(req: NextRequest) {
    const { email, redirectTo } = await req.json()
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    // Rate limit per IP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const rateLimitOk = await checkRateLimit(`ml:${ip}`)

    if (!rateLimitOk) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    // Generate single-use nonce + short code (opcionális)
    const nonce = randomBytes(16).toString('hex')
    const code = randomBytes(3).toString('hex') // 6 hex char (kényelmi debug/UX)
    const digest = createHash('sha256').update(`${email}:${code}`).digest('hex')

    // Store in Redis (15 perc)

    try {
        await storeMagicLinkSession(nonce, { digest, email }, 60 * 15)
    } catch (error) {
        console.error('Error storing magic link session:', error)
        return NextResponse.json({ error: 'Failed to store magic link session' }, { status: 500 })
    }

    // Create compact JWT to avoid very long URLs
    const jwt = await new SignJWT({ n: nonce })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuer('magic')
        .setAudience('web')
        .setExpirationTime('15m')
        .sign(JWT_SECRET)

    const url = new URL('/api/auth/magic/consume', APP_URL)
    url.searchParams.set('token', jwt)
    if (redirectTo) url.searchParams.set('next', redirectTo)

    url.searchParams.set('next', '/account')
    // Send email
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST!,
            port: Number(process.env.SMTP_PORT!),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
        })

        await transporter.sendMail({
            from: process.env.SMTP_USER!,
            to: email,
            subject: 'Your Magic Sign-In Link',
            text: `Hello,

We received a request to sign in to your account using this email address. 

Sign in by clicking the link below:
${url.toString()}

This link will expire in 15 minutes.

If you did not request this, please ignore this email.

Best,
Lifty
`,

            html: `
      <div style="max-width:460px;margin:0 auto;border-radius:8px;border:1px solid #eaeaea;padding:28px 22px 22px;font-family:'Segoe UI',Arial,sans-serif;background:#fafcff;color:#23272f;">
        <div style="text-align:center;margin-bottom:24px;">
          <img src="${APP_URL}/logo-small.webp" alt="Logo" style="width:54px;height:auto;margin-bottom:8px;border-radius:8px;" />
        </div>
        <h2 style="text-align:center;margin:0 0 18px 0;font-weight:600;font-size:1.45rem;letter-spacing:-0.01em;">Your Magic Sign-In Link</h2>
        <p style="margin:0 0 19px 0;font-size:1.05rem;">
          Click the button below to securely sign in.
        </p>
        <div style="text-align:center;margin:32px 0 24px 0;">
          <a href="${url.toString()}" style="display:inline-block;padding:14px 32px;background:#3438b7;color:#fff!important;text-decoration:none;font-size:1.08rem;font-weight:600;border-radius:6px;box-shadow:0 2px 8px rgba(52,56,183,.04);">
            Sign in to your account
          </a>
        </div>
        <p style="font-size:0.98rem;color:#545770;margin:0 0 18px 0;">
          Or copy &amp; paste this link in your browser:<br>
          <a href="${url.toString()}" style="color:#3438b7;word-break:break-all;">${url.toString()}</a>
        </p>
        <p style="font-size:0.97rem;color:#545770;margin:14px 0 6px;">This link expires in 15 minutes.<br>
          If you did not request this, you can safely ignore this email.
        </p>
        <hr style="margin:24px 0 14px;border:none;border-top:1px solid #eaeaea;">
        <div style="color:#b0b2ba;font-size:0.95rem;text-align:center;">
          Sent by <strong>Your Team</strong>
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
