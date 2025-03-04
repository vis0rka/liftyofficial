import { IFuncWithChild } from '@/utils/typeUtils'
import React from 'react'

export const ClientOnly: React.FC<IFuncWithChild> = ({ children }) => {
    const [hasMounted, setHasMounted] = React.useState(false)

    React.useEffect(() => {
        setHasMounted(true)
    }, [])

    if (!hasMounted) {
        return null
    }
    return <>{children}</>
}
