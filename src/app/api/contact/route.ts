import { verifyRecaptcha } from '@/lib/actions/checkout'
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

const contactSchema = z.object({
    name: z.string().trim().min(2, { message: 'Name must be at least 2 characters long.' }),
    email: z.string().trim().email({ message: 'Please enter a valid email address.' }),
    message: z.string().trim().min(10, { message: 'Message must be at least 10 characters long.' }),
    consent: z.boolean().refine(val => val === true, { message: 'You must accept the Privacy Policy.' }),
    token: z.string().min(1, { message: 'Missing reCAPTCHA token.' }),
})

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const parsed = contactSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    issues: parsed.error.flatten(),
                },
                { status: 400 },
            )
        }

        const { name, email, message, token } = parsed.data
        const recaptchaResult = await verifyRecaptcha(token)

        if (!recaptchaResult.success) {
            return NextResponse.json({ error: 'Invalid reCAPTCHA token.' }, { status: 400 })
        }

        const safeName = name.replace(/[\r\n]+/g, ' ')
        const safeEmail = email.replace(/[\r\n]+/g, ' ')
        const safeMessage = escapeHtml(message).replace(/\n/g, '<br />')

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST!,
            port: Number(process.env.SMTP_PORT!),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
        })

        await transporter.sendMail({
            from: process.env.SMTP_USER!,
            to: 'info@liftyofficial.com',
            replyTo: safeEmail,
            subject: `New contact message from ${safeName}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h2>New contact message</h2>
                    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                    <p><strong>Message:</strong></p>
                    <p>${safeMessage}</p>
                </div>
            `,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Contact form email error:', error)
        return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
    }
}
