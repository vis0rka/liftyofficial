import { PageSection } from '@/components/ui/page-section'
import { getTranslations } from 'next-intl/server'

export default async function AboutUsPage() {
    const t = await getTranslations('AboutUs')
    return (
        <PageSection className="max-w-[600px]">
            <div dangerouslySetInnerHTML={{ __html: t.raw('description') }} />
        </PageSection>
    )
}
