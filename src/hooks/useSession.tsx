import { SessionData } from '@/lib/auth/session'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const sessionApiRoute = '/api/auth/'

export default function useSession() {
    const queryClient = useQueryClient()
    const { data: session, isLoading } = useQuery({
        queryKey: ['session'],
        queryFn: async () => {
            const response = await axios.get<SessionData>(sessionApiRoute)
            console.log('response query', response)
            return response.data
        },
    })

    const { mutateAsync: login } = useMutation({
        mutationFn: async (params: { email: string; password: string }) => {
            const response = await axios.post(sessionApiRoute, params, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            console.log('response mutation', response)
            return response.data
        },
        onSuccess: data => {
            if (data?.error) {
                return {
                    error: data?.error,
                }
            } else {
                queryClient.setQueryData(['session'], data)
            }
        },
        onError: error => {
            console.error('onError1', error)
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    return {
                        error: 'invalid_credentials',
                    }
                }
            }
        },
    })
    const { mutateAsync: logout } = useMutation({
        mutationFn: async () => {
            return await axios.delete(sessionApiRoute)
        },
        onSuccess: data => {
            queryClient.setQueryData(['session'], data)
        },
    })

    return { session, logout, login, isLoading }
}
