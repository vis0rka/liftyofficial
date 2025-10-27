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

            return response.data
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

    return { session, logout, isLoading }
}
