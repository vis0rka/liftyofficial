import { getRedisClient } from './client'

export interface RedisSessionData {
    digest: string
    email: string
    createdAt: number
}

export async function storeMagicLinkSession(
    nonce: string,
    data: Omit<RedisSessionData, 'createdAt'>,
    ttlSeconds: number = 900, // 15 minutes default
): Promise<void> {
    const redis = getRedisClient()
    const sessionData: RedisSessionData = {
        ...data,
        createdAt: Date.now(),
    }

    try {
        await redis.setEx(`ml:nonce:${nonce}`, ttlSeconds, JSON.stringify(sessionData))
    } catch (error) {
        console.error('Failed to store magic link session:', error)
        throw error
    }
}

export async function getMagicLinkSession(nonce: string): Promise<RedisSessionData | null> {
    const redis = getRedisClient()

    try {
        const data = await redis.get(`ml:nonce:${nonce}`)
        if (!data) return null

        return JSON.parse(data) as RedisSessionData
    } catch (error) {
        console.error('Failed to get magic link session:', error)
        return null
    }
}

export async function deleteMagicLinkSession(nonce: string): Promise<void> {
    const redis = getRedisClient()

    try {
        await redis.del(`ml:nonce:${nonce}`)
    } catch (error) {
        console.error('Failed to delete magic link session:', error)
    }
}

export async function cleanupExpiredSessions(): Promise<void> {
    const redis = getRedisClient()

    try {
        // Redis automatically handles TTL expiration, but we can add manual cleanup if needed
        const keys = await redis.keys('ml:nonce:*')
        const now = Date.now()

        for (const key of keys) {
            const data = await redis.get(key)
            if (data) {
                const sessionData = JSON.parse(data) as RedisSessionData
                if (now - sessionData.createdAt > 900000) {
                    // 15 minutes
                    await redis.del(key)
                }
            }
        }
    } catch (error) {
        console.error('Failed to cleanup expired sessions:', error)
    }
}
