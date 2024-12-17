'use server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getTranslations } from 'next-intl/server'

export const EmailSub = async () => {
    const t = await getTranslations()
    return (
        <div className="mt-4">
            <h4>{t('Common.sub_to_email')}</h4>
            <div className="flex w-full max-w-sm items-center space-x-2">
                <Input className="bg-white" type="email" placeholder="Email" />
                <Button size="sm" type="submit">
                    {t('Common.subscribe')}
                </Button>
            </div>
        </div>
    )
}
