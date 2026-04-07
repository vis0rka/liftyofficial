'use server'

import { CheckoutFormValues } from '@/app/[locale]/(protected)/checkout/page'
import { localeToCountryFlag } from '@/lib/localeToCountryFlag'
import axios from 'axios'
import Stripe from 'stripe'
import { getCachedProducts } from '../api/woo/products/getProducts'
import { wooApi } from '../api/woo/woo'
import { WooTypes } from '../api/woo/WooTyps'
import { ICartItem } from '../store/cart-store'
import { createCheckoutSession } from '../stripe/server-stripe'

type CheckoutSessionLineItem = NonNullable<
    NonNullable<NonNullable<Parameters<Stripe['checkout']['sessions']['create']>[0]>['line_items']>[number]
>

export type CheckoutActionResponse = {
    success: boolean
    message?: string
    id?: string
    wooOrderId?: string
    url?: string
}

type CheckoutParams = {
    formData: CheckoutFormValues
    products: ICartItem[]
    currency: string
    lang: string
    taxRate: number
    token: string
}

export const checkout = async ({
    formData,
    products,
    currency,
    lang,
    taxRate,
    token,
}: CheckoutParams): Promise<CheckoutActionResponse> => {
    try {
        if (!token) {
            console.error('Missing reCAPTCHA token during checkout')
            return {
                success: false,
                message: 'recaptcha.failed',
            }
        }

        const recaptchaResult = await verifyRecaptcha(token)

        if (!recaptchaResult?.success) {
            console.error('reCAPTCHA verification failed', {
                errorCodes: recaptchaResult['error-codes'],
                hostname: recaptchaResult.hostname,
                action: recaptchaResult.action,
                score: recaptchaResult.score,
            })
            return {
                success: false,
                message: 'recaptcha.failed',
            }
        }

        const originalProducts = await getCachedProducts()

        if (!originalProducts) {
            console.error('something went wrong because no products')
            return {
                success: false,
                message: 'checkout.failed',
            }
        }

        const validatedItems = validateCartItems(originalProducts, products, currency)

        const line_items = validatedItems?.map(item => {
            return {
                product_id: item?.price_data?.product_data?.metadata?.id,
                quantity: item.quantity,
                subtotal: (item?.price_data?.unit_amount / (1 + taxRate) / 100).toString(),
                total: (item?.price_data?.unit_amount / (1 + taxRate) / 100).toString(),
            }
        })
        const dataToApi = {
            payment_method: 'stripe',
            payment_method_title: 'Stripe',
            status: 'pending',
            currency: currency,
            billing: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                address_1: formData.address,
                address_2: formData?.apartment ?? '',
                city: formData.city,
                postcode: formData.postalCode,
                country: formData.country,
                email: formData.email,
                phone: formData.dialCode + formData.phoneNumber,
            },
            shipping: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                address_1: formData.address,
                address_2: formData.apartment ?? '',
                city: formData.city,
                postcode: formData.postalCode,
                country: formData.country,
            },
            line_items: line_items,
            meta_data: [
                { key: 'trp_language', value: localeToCountryFlag[lang]?.metaCode ?? 'en_US' },
                { key: '_created_via', value: 'liftyofficial next.js' },
            ],
        }

        const wooResult = await wooApi.postOrder(lang, dataToApi)

        if (!wooResult?.data?.id) {
            console.error('something went wrong during the order creation...')
            return {
                success: false,
                message: 'checkout.failed',
            }
        }

        const checkoutSession = await createCheckoutSession(validatedItems, wooResult.data.id, lang)

        if (checkoutSession?.url) {
            const priorMeta = wooResult.data.meta_data ?? []
            await wooApi.putOrder(wooResult.data.id, {
                meta_data: [
                    ...priorMeta.map((m: { id?: number; key: string; value: string }) => ({
                        id: m.id,
                        key: m.key,
                        value: m.value,
                    })),
                    { key: 'stripe_checkout_session_id', value: checkoutSession.id },
                ],
            })

            return {
                success: true,
                id: checkoutSession.id,
                wooOrderId: wooResult.data.id,
                url: checkoutSession.url || '',
            }
        }
        return {
            success: false,
            message: 'checkout.failed',
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: 'checkout.failed',
        }
    }
}

export type ValidatedItem = CheckoutSessionLineItem & {
    price_data: {
        unit_amount: number
        currency: string
        product_data: {
            name: string
            images: string[]
            metadata: {
                id: number
                sku: string
            }
        }
    }
}

const validateCartItems = (originalProducts: WooTypes['getProducts'], cartProducts: ICartItem[], currency: string) => {
    const validatedItems: ValidatedItem[] = []

    try {
        for (const product of cartProducts) {
            const inventoryItem = originalProducts.find(currentProduct => {
                return currentProduct.id.toString() === product.id || currentProduct.sku === product.id
            })

            const custom_price = JSON.parse(inventoryItem?.custom_prices ?? '')

            if (inventoryItem === undefined) {
                throw new Error(`Invalid Cart: product with id "${product.id}" is not in your inventory.`)
            }

            const item = {
                price_data: {
                    currency: currency,
                    unit_amount: custom_price[currency] * 100,
                    product_data: {
                        name: product.name,
                        images: [inventoryItem?.images?.[0].src],
                        metadata: {
                            id: inventoryItem?.id,
                            sku: inventoryItem?.sku,
                        },
                    },
                },
                quantity: product.quantity,
            }

            validatedItems.push(item)
        }

        return validatedItems
    } catch (error) {
        console.error(error)
        throw Error('Something went wrong during product validation')
    }
}

export const verifyRecaptcha = async (token: string) => {
    const recaptchaResult = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
    )

    return recaptchaResult.data
}
