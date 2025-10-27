import { getRedisClient } from './client'

export interface RateLimitOptions {
    maxRequests: number
    windowMs: number
}

export async function checkRateLimit(
    identifier: string,
    options: RateLimitOptions = { maxRequests: 5, windowMs: 600000 }, // 5 requests per 10 minutes
): Promise<boolean> {
    const redis = getRedisClient()
    const key = `rate_limit:${identifier}`

    try {
        const current = await redis.get(key)

        if (!current) {
            await redis.setEx(key, Math.floor(options.windowMs / 1000), '1')
            return true
        }

        const count = parseInt(current)
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
    const redis = getRedisClient()
    const key = `rate_limit:${identifier}`

    try {
        await redis.del(key)
    } catch (error) {
        console.error('Rate limit reset failed:', error)
    }
}
