import { wooApi } from '@/lib/api/woo/woo'
import type { WooTypes } from '@/lib/api/woo/WooTyps'
import { ArrayElement } from '@/utils/typeUtils'
import deMessages from '../../../translations/de.json'
import plMessages from '../../../translations/pl.json'

export type FacebookFeedRow = {
    id: string
    title: string
    description: string
    availability: 'in stock' | 'out of stock' | 'available for order'
    condition: 'new'
    price: string
    link: string
    image_link: string
    brand: string
    sale_price?: string
    additional_image_link?: string
    google_product_category: string
    color: string
    size: string
    gender: string
    age_group: string
    material: string
    shipping: string
}

type Product = ArrayElement<WooTypes['getProducts']>

const BASE_URL = 'https://liftyofficial.com'
const BRAND = 'Lifty'
const GOOGLE_PRODUCT_CATEGORY = 'Baby & Toddler > Baby Transport > Baby Carriers'
const SIZE = 'One Size'
const GENDER = 'unisex'
const AGE_GROUP = 'toddler'
const MATERIAL = '100% Cotton'

export type FeedLocale = 'pl' | 'de'

export type FeedLocaleConfig = {
    locale: FeedLocale
    currency: string
    carrierColors: Record<string, string>
    carrierDescription: string
    toddlerCarrierLabel: string
    shipping: string
}

export const FEED_LOCALE_CONFIGS: Record<FeedLocale, FeedLocaleConfig> = {
    pl: {
        locale: 'pl',
        currency: 'PLN',
        carrierColors: plMessages.Product.carrier_colors,
        carrierDescription: plMessages.Product.toddler_carrier.short,
        toddlerCarrierLabel: plMessages.Common.toddler_carrier,
        shipping: 'PL:::0.0 PLN',
    },
    de: {
        locale: 'de',
        currency: 'EUR',
        carrierColors: deMessages.Product.carrier_colors,
        carrierDescription: deMessages.Product.toddler_carrier.short,
        toddlerCarrierLabel: 'Kleinkindtrage',
        shipping: 'DE:::0.0 EUR',
    },
}

export const FACEBOOK_FEED_FILES: { locale: FeedLocale; filename: string }[] = [
    { locale: 'pl', filename: 'facebook-product-feed-pl.csv' },
    { locale: 'de', filename: 'facebook-product-feed-de.csv' },
]

const FEED_COLUMNS: (keyof FacebookFeedRow)[] = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'link',
    'image_link',
    'brand',
    'sale_price',
    'additional_image_link',
    'google_product_category',
    'color',
    'size',
    'gender',
    'age_group',
    'material',
    'shipping',
]

export function stripHtml(html: string): string {
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

export function formatMetaPrice(amount: string | number, currency: string): string {
    const numeric = typeof amount === 'number' ? amount : parseFloat(amount)
    if (Number.isNaN(numeric)) return ''
    return `${numeric.toFixed(2)} ${currency}`
}

export function getAvailability(product: Product): FacebookFeedRow['availability'] {
    if (product.stock_status === 'onbackorder') return 'available for order'
    if ((product.stock_quantity ?? 0) > 0 || product.backorders_allowed) return 'in stock'
    return 'out of stock'
}

function getPriceForCurrency(product: Product, currency: string): string {
    if (product.custom_prices) {
        try {
            const parsed = JSON.parse(product.custom_prices) as Record<string, string>
            if (parsed[currency]) return parsed[currency]
        } catch {
            // fall through to Woo price
        }
    }
    return product.price || product.regular_price || '0'
}

function getProductColorKey(product: Product): string | undefined {
    const colorAttr = product.attributes?.find(attr => attr.name === 'color')
    return colorAttr?.options?.[0]
}

function getColorDisplayName(colorKey: string | undefined, carrierColors: Record<string, string>): string {
    if (!colorKey) return ''
    const mapped = carrierColors[colorKey] ?? carrierColors[colorKey.replace('grey', 'gray')]
    return mapped ?? colorKey
}

function isCarrierProduct(product: Product): boolean {
    return product.tags?.some(tag => tag.slug === 'carrier' || tag.name === 'carrier') ?? false
}

function buildTitle(product: Product, config: FeedLocaleConfig): string {
    const colorName = getColorDisplayName(getProductColorKey(product), config.carrierColors)
    const base = `Lifty - ${config.toddlerCarrierLabel}`
    return colorName ? `${base} - ${colorName}` : base
}

function buildDescription(product: Product, config: FeedLocaleConfig): string {
    if (isCarrierProduct(product)) return config.carrierDescription
    const wooText = stripHtml(product.short_description || product.description || '')
    return wooText || product.name
}

export type MapProductOptions = {
    baseUrl?: string
    config?: FeedLocaleConfig
}

export function mapProductToFeedRow(product: Product, options: MapProductOptions = {}): FacebookFeedRow | null {
    const baseUrl = options.baseUrl ?? BASE_URL
    const config = options.config ?? FEED_LOCALE_CONFIGS.pl

    const imageLink = product.images?.[0]?.src
    if (!imageLink || !product.slug) return null

    const priceAmount = getPriceForCurrency(product, config.currency)
    const colorName = getColorDisplayName(getProductColorKey(product), config.carrierColors)
    const row: FacebookFeedRow = {
        id: product.id.toString(),
        title: buildTitle(product, config),
        description: buildDescription(product, config),
        availability: getAvailability(product),
        condition: 'new',
        price: formatMetaPrice(priceAmount, config.currency),
        link: `${baseUrl}/${config.locale}/shop/${product.slug}`,
        image_link: imageLink,
        brand: BRAND,
        google_product_category: GOOGLE_PRODUCT_CATEGORY,
        color: colorName,
        size: SIZE,
        gender: GENDER,
        age_group: AGE_GROUP,
        material: MATERIAL,
        shipping: config.shipping,
    }

    if (product.on_sale && product.sale_price) {
        row.sale_price = formatMetaPrice(product.sale_price, config.currency)
    }

    const additionalImages = (product.images ?? [])
        .slice(1)
        .map(img => img.src)
        .filter(Boolean)
    if (additionalImages.length > 0) {
        row.additional_image_link = additionalImages.join(',')
    }

    return row
}

export function escapeCsvField(value: string): string {
    if (/[",\n\r]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`
    }
    return value
}

export function feedRowsToCsv(rows: FacebookFeedRow[]): string {
    const header = FEED_COLUMNS.join(',')
    const body = rows.map(row =>
        FEED_COLUMNS.map(col => {
            const value = row[col]
            return value != null && value !== '' ? escapeCsvField(String(value)) : ''
        }).join(','),
    )
    return [header, ...body].join('\n')
}

export async function fetchPublishedProducts(): Promise<Product[]> {
    const products: Product[] = []
    let page = 1
    const perPage = 100

    while (true) {
        const batch = await wooApi.getProducts({
            per_page: perPage,
            page,
            status: 'publish',
        })

        if (!batch?.length) break
        products.push(...batch)
        if (batch.length < perPage) break
        page += 1
    }

    return products
}

export async function generateFacebookProductFeedCsv(locale: FeedLocale = 'pl'): Promise<string> {
    const products = await fetchPublishedProducts()
    const config = FEED_LOCALE_CONFIGS[locale]
    const rows = products
        .map(product => mapProductToFeedRow(product, { config }))
        .filter((row): row is FacebookFeedRow => row != null)

    return feedRowsToCsv(rows)
}

export async function generateFacebookProductFeeds(): Promise<{ locale: FeedLocale; filename: string; csv: string }[]> {
    const products = await fetchPublishedProducts()

    return FACEBOOK_FEED_FILES.map(({ locale, filename }) => {
        const config = FEED_LOCALE_CONFIGS[locale]
        const rows = products
            .map(product => mapProductToFeedRow(product, { config }))
            .filter((row): row is FacebookFeedRow => row != null)

        return { locale, filename, csv: feedRowsToCsv(rows) }
    })
}
