'use client'

import { ErrorCard } from '@/components/error/ErrorCard'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import dynamic from 'next/dynamic'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import React from 'react'

interface ModalDefiniation {
    modal: React.ReactNode
    protected: boolean
}

export type ModalKeys = 'login'

const LoginModal = dynamic(() => import('./login/LoginModal'), { ssr: false })

const modalRoutes: Record<ModalKeys, ModalDefiniation> = {
    login: { modal: <LoginModal />, protected: false },
}

const ModalService = () => {
    const searchParams = useSearchParams()
    const modalType = searchParams.get('modal') as ModalKeys

    const modal = modalRoutes[modalType] ?? null

    if (!modal) return null

    return <ErrorBoundary fallback={<DialogError />}>{modal.modal}</ErrorBoundary>
}

export const useModals = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const openModal = React.useCallback(
        (modalType: ModalKeys) => {
            const query = Object.fromEntries(searchParams.entries())

            router.replace(`${pathname}?${new URLSearchParams({ ...query, modal: modalType }).toString()}`)
        },
        [router, pathname, searchParams],
    )

    const closeModals = React.useCallback(() => {
        const query = Object.fromEntries(searchParams.entries())
        delete query['modal']
        delete query['from']

        router.replace(`${pathname}?${new URLSearchParams({ ...query }).toString()}`)
    }, [router, pathname, searchParams])

    return { openModal, closeModals }
}

const DialogError = () => {
    const [isOpen, setOpen] = React.useState(true)
    const { closeModals } = useModals()

    React.useEffect(() => {
        return () => {
            closeModals()
        }
    }, [closeModals])

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>Error</DialogTitle>
                <DialogDescription>
                    <ErrorCard />
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

export default ModalService
