import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

const metadataBase = new URL('https://liftyofficial.com')

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale })

    const title = t('Metadata.title')
    const description = t('Metadata.description')

    return {
        metadataBase,
        openGraph: {
            title,
            description,
            type: 'website',
            siteName: 'Lifty',
            images: [
                {
                    url: `/${locale}/opengraph-image`,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`/${locale}/twitter-image`],
        },
    }
}

export default async function PublicLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Props['params']
}) {
    const { locale } = await params

    const websiteJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Lifty',
        url: metadataBase.href,
        inLanguage: locale,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${metadataBase.href}/${locale}/shop?search={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    }

    const organizationJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Lifty',
        url: metadataBase.href,
        logo: `${metadataBase.href}/favicon.svg`,
    }

    return (
        <>
            {children}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
            />
        </>
    )
}
