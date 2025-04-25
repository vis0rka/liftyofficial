'use client'

import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'
import { useModals } from '../ModalService'
const LoginModal = () => {
    const { closeModals } = useModals()
    const t = useTranslations()
    return (
        <Dialog
            open
            onOpenChange={open => {
                if (!open) {
                    closeModals()
                }
            }}
        >
            <DialogContent>
                <DialogTitle>{t('Common.login')}</DialogTitle>
                <DialogFooter className="flex sm:flex-col sm:space-y-4 justify-center items-center"></DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default LoginModal
