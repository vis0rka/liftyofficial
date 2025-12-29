import { createClient, RedisClientType } from 'redis'

let redis: RedisClientType | null = null
let connectionPromise: Promise<RedisClientType> | null = null

export async function getRedisClient(): Promise<RedisClientType> {
    // If already connected, return immediately
    if (redis && redis.isOpen) {
        return redis
    }

    // If connection is in progress, wait for it
    if (connectionPromise) {
        return connectionPromise
    }

    // Create new connection
    connectionPromise = (async () => {
        let connectionError: Error | null = null
        let errorHandler: ((error: Error) => void) | null = null

        try {
            if (!redis) {
                redis = createClient({
                    url: process.env.REDIS_URL || 'redis://localhost:6379',
                    socket: {
                        connectTimeout: 5000, // 5 second timeout
                        reconnectStrategy: false,
                    },
                })

                // Capture connection errors
                errorHandler = (error: Error) => {
                    console.error('Redis connection error:', error)
                    connectionError = error
                }
                redis.on('error', errorHandler)

                redis.on('connect', () => {
                    console.log('Connected to Redis')
                })
            }

            // Ensure connection is established
            if (!redis.isOpen) {
                // Set up timeout
                const timeoutPromise = new Promise<never>((_, reject) => {
                    setTimeout(() => {
                        reject(
                            new Error('Redis connection timeout: Unable to connect to Redis server within 5 seconds'),
                        )
                    }, 5000)
                })

                // Attempt connection with timeout
                try {
                    await Promise.race([redis.connect(), timeoutPromise])
                } catch (connectError) {
                    // If we have a captured error, use that instead
                    if (connectionError) {
                        throw connectionError
                    }
                    throw connectError
                }

                // Verify connection by pinging Redis
                try {
                    await redis.ping()
                } catch (pingError) {
                    throw new Error(
                        `Redis connection verification failed: ${pingError instanceof Error ? pingError.message : 'Unable to ping Redis server'}`,
                    )
                }
            }

            // Remove error handler after successful connection
            if (errorHandler && redis) {
                redis.off('error', errorHandler)
            }

            connectionPromise = null // Reset promise after successful connection
            return redis
        } catch (error) {
            connectionPromise = null // Reset promise on error

            // Clean up error handler
            if (errorHandler && redis) {
                redis.off('error', errorHandler)
            }

            // Clean up failed client
            if (redis && !redis.isOpen) {
                try {
                    await redis.quit().catch(() => {}) // Ignore quit errors
                } catch {
                    // Ignore
                }
                redis = null
            }

            console.error('Error connecting to Redis:', error)
            throw error // Propagate error so callers can handle it
        }
    })()

    return connectionPromise
}

export async function disconnectRedis(): Promise<void> {
    if (redis) {
        await redis.disconnect()
        redis = null
        connectionPromise = null
    }
}
