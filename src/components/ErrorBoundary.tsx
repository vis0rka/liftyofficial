'use client'
import React from 'react'
import { ErrorCard } from './error/ErrorCard'

interface Props {
    silent?: boolean
    fallback?: React.ReactElement
    onError?: () => void
    children?: React.ReactNode
}

interface State {
    hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error(error, errorInfo)
        this.props.onError?.()

        if (error.name === 'ChunkLoadError') {
            window.location.reload()
        }
    }

    render() {
        if (this.state.hasError) {
            if (this.props.silent) {
                return null
            }

            return this.props.fallback ?? <ErrorCard />
        }

        return this.props.children || null
    }
}
