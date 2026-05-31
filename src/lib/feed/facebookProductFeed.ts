import { wooApi } from '@/lib/api/woo/woo'
import type { WooTypes } from '@/lib/api/woo/WooTyps'
import { ArrayElement } from '@/utils/typeUtils'
import enMessages from '../../../translations/en.json'

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
    item_group_id?: string
}

type Product = ArrayElement<WooTypes['getProducts']>

const BASE_URL = 'https://liftyofficial.com'
const LOCALE = 'en'
const CURRENCY = 'EUR'
const BRAND = 'Lifty'
const CARRIER_ITEM_GROUP_ID = 'lifty-carrier'

const CARRIER_COLORS: Record<string, string> = enMessages.Product.carrier_colors
const TODDLER_CARRIER_LABEL = 'Toddler hip carrier'
const CARRIER_DESCRIPTION = enMessages.Product.toddler_carrier.short

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
    'item_group_id',
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

function getEurPrice(product: Product): string {
    if (product.custom_prices) {
        try {
            const parsed = JSON.parse(product.custom_prices) as Record<string, string>
            if (parsed.EUR) return parsed.EUR
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

function getColorDisplayName(colorKey: string | undefined): string {
    if (!colorKey) return ''
    const mapped = CARRIER_COLORS[colorKey] ?? CARRIER_COLORS[colorKey.replace('grey', 'gray')]
    return mapped ?? colorKey
}

function isCarrierProduct(product: Product): boolean {
    return product.tags?.some(tag => tag.slug === 'carrier' || tag.name === 'carrier') ?? false
}

function buildTitle(product: Product): string {
    const colorName = getColorDisplayName(getProductColorKey(product))
    const base = `Lifty - ${TODDLER_CARRIER_LABEL}`
    return colorName ? `${base} - ${colorName}` : base
}

function buildDescription(product: Product): string {
    if (isCarrierProduct(product)) return CARRIER_DESCRIPTION
    const wooText = stripHtml(product.short_description || product.description || '')
    return wooText || product.name
}

export type MapProductOptions = {
    baseUrl?: string
    locale?: string
    currency?: string
}

export function mapProductToFeedRow(product: Product, options: MapProductOptions = {}): FacebookFeedRow | null {
    const baseUrl = options.baseUrl ?? BASE_URL
    const locale = options.locale ?? LOCALE
    const currency = options.currency ?? CURRENCY

    const imageLink = product.images?.[0]?.src
    if (!imageLink || !product.slug) return null

    const eurAmount = getEurPrice(product)
    const row: FacebookFeedRow = {
        id: product.id.toString(),
        title: buildTitle(product),
        description: buildDescription(product),
        availability: getAvailability(product),
        condition: 'new',
        price: formatMetaPrice(eurAmount, currency),
        link: `${baseUrl}/${locale}/shop/${product.slug}`,
        image_link: imageLink,
        brand: BRAND,
    }

    if (product.on_sale && product.sale_price) {
        row.sale_price = formatMetaPrice(product.sale_price, currency)
    }

    const additionalImages = (product.images ?? [])
        .slice(1)
        .map(img => img.src)
        .filter(Boolean)
    if (additionalImages.length > 0) {
        row.additional_image_link = additionalImages.join(',')
    }

    if (isCarrierProduct(product)) {
        row.item_group_id = CARRIER_ITEM_GROUP_ID
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

export async function generateFacebookProductFeedCsv(): Promise<string> {
    const products = await fetchPublishedProducts()
    const rows = products
        .map(product => mapProductToFeedRow(product))
        .filter((row): row is FacebookFeedRow => row != null)

    return feedRowsToCsv(rows)
}
