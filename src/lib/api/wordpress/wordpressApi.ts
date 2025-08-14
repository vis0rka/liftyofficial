import axios from 'axios'

export type LoginResponse = {
    user_id: number
    user_email: string
    user_login: string
    token: string
    status: number
}
export interface LoginResponseError {
    code: string
    message: string
    data: {
        status: number
    }
}

class WordpressApi {
    readonly baseUrl = 'https://liftyofficial.com/wp-json/custom/v1/'

    client = axios.create({
        baseURL: this.baseUrl,
        timeout: 30000,
        headers: {
            'x-security-token': process.env.WORDPRESS_TOKEN ?? '',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
    })

    login = async (email: string, password: string) => {
        try {
            const response = await this.client.post<LoginResponse>('/login', {
                email,
                password,
            })
            return response
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response
            }
        }
    }
    logout = async () => {
        try {
            const response = await this.client.post('/logout')

            return response
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response
            }
        }
    }

    getUser = async (userId: number, token: string) => {
        try {
            const response = await this.client.get(`/getUser`, {
                params: {
                    userId,
                },
                headers: {
                    'X-WP-Nonce': token,
                },
            })
            return response
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response
            }
        }
    }
}
export const wordpressApi = new WordpressApi()
