export interface UserCredentials {
    username: string
    password: string
}

export interface AuthSession {
    user: {
        id: string
        name: string
        email: string
        role: string
    }
    accessToken: string
    expiresAt: number
}

export interface WordPressProviderOptions {
    apiUrl: string
    clientId: string
    clientSecret: string
}
