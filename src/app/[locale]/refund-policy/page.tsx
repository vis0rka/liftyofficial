import { RecentlyViewed } from '@/components/products/recently-viewed/RecentlyViewed'
import { getTranslations } from 'next-intl/server'

export default async function RefundPage() {
    const t = await getTranslations('Refund')
    return (
        <section className="container mx-auto flex flex-col my-8 space-y-8 items-center min-h-[600px]">
            <h1 className="text-4xl font-semibold">{t('policy')}</h1>
            <div className="space-y-4 max-w-4xl">
                <p dangerouslySetInnerHTML={{ __html: t.raw('first') }} />

                <p dangerouslySetInnerHTML={{ __html: t.raw('second') }} />
                <p dangerouslySetInnerHTML={{ __html: t.raw('third') }} />

                <p dangerouslySetInnerHTML={{ __html: t.raw('fourth') }} />
                <p dangerouslySetInnerHTML={{ __html: t.raw('fifth') }} />
            </div>
            <RecentlyViewed />
        </section>
    )
}
