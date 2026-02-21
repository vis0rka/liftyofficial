import { useCallback, useSyncExternalStore } from 'react'

type Breakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'

const breakpoints: Record<Breakpoints, string> = {
    xs: '0',
    sm: '40rem', // 640px
    md: '48rem', // 768px
    lg: '64rem', // 1024px
    xl: '80rem', // 1280px
    xxl: '96rem', // 1536px
    xxxl: '120rem', // 1920px
}

export const useBreakpoint = (from: Breakpoints, until = false) => {
    const query = `(${until ? 'max-width' : 'min-width'}: ${breakpoints[from]})`

    const subscribe = useCallback(
        (callback: () => void) => {
            const media = window.matchMedia(query)
            media.addEventListener('change', callback)
            return () => media.removeEventListener('change', callback)
        },
        [query],
    )

    const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

    const getServerSnapshot = useCallback(() => false, [])

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
