'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { routing } from '@/i18n/routing'
import { useParams, usePathname, useRouter } from 'next/navigation'
import ReactCountryFlag from 'react-country-flag'

const localeToCountryFlag: Record<string, { flag: string; name: string }> = {
    en: { flag: 'GB', name: 'English' },
    de: { flag: 'DE', name: 'Deutsch' },
    pl: { flag: 'PL', name: 'Polish' },
}

export default function LanguageSwitcher() {
    const router = useRouter()
    const pathname = usePathname()
    const { locale } = useParams()

    const handleLanguageChange = (newLocale: string) => {
        const newPathname = `/${newLocale}${pathname.replace(`/${locale}`, '')}`

        router.push(newPathname)
    }

    return (
        <Select onValueChange={handleLanguageChange} value={locale as string}>
            <SelectTrigger className="w-[50px] sm:w-fit">
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
