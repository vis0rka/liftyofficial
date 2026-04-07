import { createHmac, timingSafeEqual } from 'crypto'

/** Default: 48h — must cover Stripe Checkout session lifetime (up to 24h) with margin */
const MAX_AGE_SEC = 48 * 60 * 60

function getSecret(): string {
    return process.env.CHECKOUT_CANCEL_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET ?? ''
}

export function signCheckoutCancelToken(orderId: string): string {
    const secret = getSecret()
    if (!secret) {
        throw new Error('CHECKOUT_CANCEL_SECRET or STRIPE_WEBHOOK_SECRET must be set for checkout cancel URLs')
    }
    const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC
    const payload = `${orderId}:${exp}`
    const sig = createHmac('sha256', secret).update(payload).digest('hex')
    return Buffer.from(`${payload}:${sig}`, 'utf8').toString('base64url')
}

export function verifyCheckoutCancelToken(orderId: string, token: string): boolean {
    const secret = getSecret()
    if (!secret) return false
    try {
        const decoded = Buffer.from(token, 'base64url').toString('utf8')
        const lastColon = decoded.lastIndexOf(':')
        if (lastColon === -1) return false
        const payload = decoded.slice(0, lastColon)
        const sig = decoded.slice(lastColon + 1)
        const expectedSig = createHmac('sha256', secret).update(payload).digest('hex')
        if (
            sig.length !== expectedSig.length ||
            !timingSafeEqual(Buffer.from(sig, 'utf8'), Buffer.from(expectedSig, 'utf8'))
        ) {
            return false
        }
        const colonInPayload = payload.indexOf(':')
        if (colonInPayload === -1) return false
        const id = payload.slice(0, colonInPayload)
        const expStr = payload.slice(colonInPayload + 1)
        if (id !== orderId) return false
        const exp = parseInt(expStr, 10)
        if (Number.isNaN(exp) || exp < Math.floor(Date.now() / 1000)) return false
        return true
    } catch {
        return false
    }
}
