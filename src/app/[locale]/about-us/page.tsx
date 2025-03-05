import { getTranslations } from 'next-intl/server'

export default async function AboutUsPage() {
    const t = await getTranslations('AboutUs')
    return (
        <section className="container flex flex-col p-4 mx-auto gap-6 max-w-[600px]">
            <div dangerouslySetInnerHTML={{ __html: t.raw('description') }} />
        </section>
    )
}
