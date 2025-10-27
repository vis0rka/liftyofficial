import { cn } from '@/lib/utils'
import React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
}

export const PageSection = ({ children, className, ...props }: Props) => {
    return (
        <section className={cn('mx-auto p-3 flex flex-col xl:p-4 2xl:p-6', className)} {...props}>
            {children}
        </section>
    )
}
