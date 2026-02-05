import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useParams } from 'next/navigation'

interface MagicLinkRequest {
    email: string
    redirectTo?: string
    locale?: string
}

export function useMagicLink() {
    const { locale } = useParams()

    return useMutation({
        mutationFn: async ({ email, redirectTo }: MagicLinkRequest) => {
            const response = await axios.post('/api/auth/magic/request', {
                email,
                redirectTo: redirectTo || window.location.pathname,
                locale: locale,
            })

            return response.data
        },
    })
}
