'use server'

import { Link } from '@/i18n/routing'
import { routes } from '@/utils/routes'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Separator } from '../ui/separator'
import { EmailSub } from './email-sub/EmailSub'

export const Footer = async () => {
    const t = await getTranslations()

    return (
        <footer className="bg-stone-100 md:p-4 border-stone-200 border-t-2">
            <div className="container mx-auto flex flex-row flex-wrap justify-between gap-4">
                <div className="flex flex-col">
                    <h2 className="text-2xl">{t('Common.legal')}</h2>
                    <Link href={routes.shipping}>
                        <p className="text-sm">{t('Common.shipping')}</p>
                    </Link>
                    <Link href={routes.refund}>
                        <p className="text-sm">{t('Common.refund')}</p>
                    </Link>
                    <Link href={routes.privacy}>
                        <p className="text-sm">{t('Common.privacy_policy')}</p>
                    </Link>
                    <p className="text-sm">{t('Common.t_c')}</p>
                </div>
                <div className="flex flex-col">
                    <h2 className="text-2xl">{t('Common.quick_links')}</h2>
                    <p className="text-sm">{t('Common.shop')}</p>
                    <p className="text-sm">{t('Common.contact')}</p>
                    <p className="text-sm">{t('Common.about_us')}</p>
                    <p className="text-sm">{t('Common.carrier_instuctions')}</p>
                </div>
                <div className="flex flex-col">
                    <Image
                        src="/images/logo-small.webp"
                        width={120}
                        height={0}
                        alt="lifty-logo"
                        style={{
                            objectFit: 'contain',
                            maxWidth: '100%',
                            height: 'auto',
                        }}
                        className="w-16 md:w-20 lg:w-24"
                    />
                    <EmailSub />
                </div>
            </div>
            <Separator className="mt-4" />
            <div className="mt-4 container mx-auto flex flex-col items-center justify-center space-y-4">
                <p className="text-xs text-slate-500">2024 ©lifty, All rights reserved</p>
                <Image
                    src="/images/stripe-cc-payments1.webp"
                    alt="stripe"
                    width={300}
                    height={120}
                    style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
                />
            </div>
        </footer>
    )
}
