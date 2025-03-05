/* eslint-disable @typescript-eslint/no-require-imports */
import { getCachedProducts } from '@/lib/api/woo/products/getProducts'
import { WooTypes } from '@/lib/api/woo/WooTyps'
import { stripe } from '@/lib/stripe/stripe'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Product } from 'use-shopping-cart/core'

export async function POST(request: NextRequest) {
    const { cartProducts, orderId } = await request.json()
    try {
        const originalProducts = await getCachedProducts()
        if (!originalProducts) {
            return NextResponse.json({ error: 'something went wrong' }, { status: 500 })
        }

        const line_items = validateCartItems(originalProducts, Object.values(cartProducts))

        const headersList = await headers()

        const locale = request.cookies.get('NEXT_LOCALE')?.value

        const checkoutSession = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items,
            success_url: `${headersList.get('origin')}/${locale}/payment-success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
            cancel_url: `${headersList.get('origin')}/${locale}/`,
        })
        return NextResponse.json({ sessionId: checkoutSession.id })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 })
    }
}

interface ValidatedItem {
    price_data: {
        currency: string
        unit_amount: number
        product_data: {
            name: string
            images: string[]
        }
    }
    quantity: number
}

const validateCartItems = (originalProducts: WooTypes['getProducts'], cartProducts: Product[]) => {
    const validatedItems: ValidatedItem[] = []

    for (const product of cartProducts) {
        const inventoryItem = originalProducts.find(currentProduct => {
            return currentProduct.id.toString() === product.id || currentProduct.sku === product.id
        })

        if (inventoryItem === undefined) {
            throw new Error(`Invalid Cart: product with id "${product.id}" is not in your inventory.`)
        }

        const item = {
            price_data: {
                currency: 'EUR',
                unit_amount: Number(inventoryItem.price) * 100,
                product_data: {
                    name: product.name,
                    images: [inventoryItem?.images?.[0].src],
                    ...product.product_data,
                },
                ...product.price_data,
            },
            quantity: product.quantity,
        }

        validatedItems.push(item)
    }

    return validatedItems
}
