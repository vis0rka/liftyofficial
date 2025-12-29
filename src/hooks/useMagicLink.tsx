import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface MagicLinkRequest {
    email: string
    redirectTo?: string
}

export function useMagicLink() {
    return useMutation({
        mutationFn: async ({ email, redirectTo }: MagicLinkRequest) => {
            const response = await axios.post('/api/auth/magic/request', {
                email,
                redirectTo: redirectTo || window.location.pathname,
            })
            console.log('link', response.data)
            return response.data
        },
    })
}
