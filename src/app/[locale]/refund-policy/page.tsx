import { RecentlyViewed } from '@/components/products/recently-viewed/RecentlyViewed'
import { PageSection } from '@/components/ui/page-section'
import { getTranslations } from 'next-intl/server'

export default async function RefundPage() {
    const t = await getTranslations('Refund')
    return (
        <PageSection className="space-y-8 items-center min-h-[600px]">
            <h1 className="heading-1">{t('policy')}</h1>
            <div className="space-y-4 max-w-4xl">
                <p dangerouslySetInnerHTML={{ __html: t.raw('first') }} />

                <p dangerouslySetInnerHTML={{ __html: t.raw('second') }} />
                <p dangerouslySetInnerHTML={{ __html: t.raw('third') }} />

                <p dangerouslySetInnerHTML={{ __html: t.raw('fourth') }} />
                <p dangerouslySetInnerHTML={{ __html: t.raw('fifth') }} />
            </div>
            <RecentlyViewed />
        </PageSection>
    )
}
