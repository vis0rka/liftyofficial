'use server'

import { getTranslations } from 'next-intl/server'

export const Runner = async () => {
    const t = await getTranslations()

    const showRunner = process.env.SHOW_RUNNER === 'true'

    if (!showRunner) return null

    return (
        <div className="w-full bg-green-800 h-12 md:h-10 flex items-center justify-center">
            <span className="mx-4 text-base md:text-lg font-medium text-white text-center">
                {t('Runner.free_shipping')}
            </span>
        </div>
    )
}
