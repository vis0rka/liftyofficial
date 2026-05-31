import { Redis } from '@upstash/redis'

let redis: Redis | null = null

export function getRedisClient(): Redis {
    // Upstash Redis is stateless, so we can create a singleton instance
    if (!redis) {
        redis = new Redis({
            url: process.env.KV_REST_API_URL!,
            token: process.env.KV_REST_API_TOKEN!,
        })
    }

    return redis
}

// Upstash Redis is stateless, so disconnect is a no-op
export async function disconnectRedis(): Promise<void> {
    // No-op for Upstash Redis as it doesn't maintain persistent connections
    redis = null
}
