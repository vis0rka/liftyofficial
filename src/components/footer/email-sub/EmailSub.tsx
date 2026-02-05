'use server'
import { getTranslations } from 'next-intl/server'
import { EmailForm } from './EmailForm'

export const EmailSub = async () => {
    const t = await getTranslations()

    return (
        <div className="mt-4">
            <h4>{t('Common.sub_to_email')}</h4>
            <div className="flex w-full max-w-sm items-center space-x-2">
                <EmailForm />
            </div>
        </div>
    )
}
