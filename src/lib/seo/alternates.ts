import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'

type Alternates = NonNullable<Metadata['alternates']>

/**
 * Build canonical + hreflang alternates for a given locale path.
 *
 * `path` must be the URL path *without* the locale prefix, e.g.:
 * - '' or '/' for home
 * - '/shop'
 * - '/shop/some-product'
 */
export function buildAlternates(locale: string, path: string): Alternates {
    const normalizedPath = path === '/' ? '' : path
    const suffix = normalizedPath.startsWith('/') || normalizedPath === '' ? normalizedPath : `/${normalizedPath}`

    return {
        canonical: `/${locale}${suffix}`,
        languages: Object.fromEntries(routing.locales.map(l => [l, `/${l}${suffix}`])),
    }
}
