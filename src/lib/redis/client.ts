import { createClient, RedisClientType } from 'redis'

let redis: RedisClientType | null = null

export function getRedisClient(): RedisClientType {
    if (!redis) {
        redis = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
        })

        redis.connect().catch(console.error)
    }

    return redis
}

export async function disconnectRedis(): Promise<void> {
    if (redis) {
        await redis.disconnect()
        redis = null
    }
}
