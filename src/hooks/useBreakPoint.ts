import { useEffect, useState } from 'react'

type Breakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'

const breakpoints: Record<Breakpoints, string> = {
    xs: '0',
    sm: '40rem',
    md: '48rem',
    lg: '64rem',
    xl: '80rem',
    xxl: '96rem',
    xxxl: '120rem',
}

export const useBreakpoint = (from: Breakpoints) => {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const media = window.matchMedia(`(min-width: ${breakpoints[from]})`)
        if (media.matches !== matches) {
            setMatches(media.matches)
        }

        const listener = () => {
            setMatches(media.matches)
        }

        media.addEventListener('change', listener)

        return () => {
            media.removeEventListener('change', listener)
        }
    }, [matches, from])

    return matches
}
