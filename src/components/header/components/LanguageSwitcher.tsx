'use client' // Mark this as a Client Component

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { routing } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import ReactCountryFlag from 'react-country-flag'

const localeToCountryFlag: Record<string, { flag; name }> = {
    en: { flag: 'GB', name: 'English' },
    de: { flag: 'DE', name: 'Deutsch' },
    pl: { flag: 'PL', name: 'Polish' },
}

export default function LanguageSwitcher() {
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()
    console.log(locale)
    const handleLanguageChange = (newLocale: string) => {
        const newPathname = `/${newLocale}${pathname.replace(`/${locale}`, '')}`
        router.push(newPathname)
    }

    return (
        <Select onValueChange={handleLanguageChange} value={locale}>
            <SelectTrigger className="w-[50px] sm:w-[150px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {routing.locales.map(country => (
                    <SelectItem key={country} value={country}>
                        <div className="flex items-center gap-2">
                            <ReactCountryFlag
                                countryCode={localeToCountryFlag[country].flag}
                                svg
                                style={{ width: '1.5em', height: '1.5em' }}
                            />
                            <span>{localeToCountryFlag[country].name}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
