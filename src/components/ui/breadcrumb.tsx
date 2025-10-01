'use client'

import React from 'react'

import { Link, routing } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

export const Breadcrumb = () => {
    const paths = usePathname()
    const t = useTranslations()
    const pathNames = paths
        .split('/')
        .filter(path => !routing.locales.includes(path as any))
        .filter(Boolean)

    const currentPathWithoutLang = '/' + pathNames.join('/')

    return (
        <div>
            <ul className="flex flex-row">
                <li className="hover:underline mx-1">
                    <Link href={'/'}>{t('Common.home')}</Link>
                </li>
                {pathNames.length > 0 && <span> | </span>}
                {pathNames.map((link, index) => {
                    const href = `/${pathNames.slice(0, index + 1).join('/')}`
                    const activaPath = currentPathWithoutLang === href

                    const itemClasses = activaPath ? 'pointer-events-none mx-1 opacity-80' : 'hover:underline mx-1'
                    const itemLink = link[0].toUpperCase() + link.slice(1, link.length)

                    return (
                        <React.Fragment key={index}>
                            <li className={itemClasses}>
                                <Link href={href}>{itemLink}</Link>
                            </li>
                            {pathNames.length !== index + 1 && <span> | </span>}
                        </React.Fragment>
                    )
                })}
            </ul>
        </div>
    )
}
