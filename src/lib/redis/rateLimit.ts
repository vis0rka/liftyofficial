import { getRedisClient } from './client'

export interface RateLimitOptions {
    maxRequests: number
    windowMs: number
}

export async function checkRateLimit(
    identifier: string,
    options: RateLimitOptions = { maxRequests: 5, windowMs: 600000 }, // 5 requests per 10 minutes
): Promise<boolean> {
    const key = `rate_limit:${identifier}`

    try {
        const redis = getRedisClient()
        const current = await redis.get(key)

        if (!current) {
            await redis.set(key, '1', { ex: Math.floor(options.windowMs / 1000) })
            return true
        }

        const count = typeof current === 'string' ? parseInt(current) : Number(current)
        if (count >= options.maxRequests) {
            return false
        }

        await redis.incr(key)
        return true
    } catch (error) {
        console.error('Rate limit check failed:', error)
        return true // Fail open - allow request if Redis is down
    }
}

export async function resetRateLimit(identifier: string): Promise<void> {
    const key = `rate_limit:${identifier}`

    try {
        const redis = getRedisClient()
        await redis.del(key)
    } catch (error) {
        console.error('Rate limit reset failed:', error)
    }
}
