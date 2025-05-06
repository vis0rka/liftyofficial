'use client'
import { ErrorCard } from '@/components/error/ErrorCard'
import { ProductCard } from '@/components/products/card/ProductCard'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { productQueryOption } from '@/lib/api/woo/products/productQueries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import React from 'react'

// List accepted values
const productFilters = ['bestsellers', 'newest', 'price_low_to_high', 'price_high_to_low', 'featured'] as const

type ProductFilters = (typeof productFilters)[number]

export const ProductListWithFilters = () => {
    const { data, isError } = useSuspenseQuery(productQueryOption)
    const [filter, setFilter] = useQueryState('filter', parseAsStringLiteral(productFilters).withDefault('bestsellers'))

    const t = useTranslations()

    const filteredProducts = React.useMemo(() => {
        if (filter === 'bestsellers') {
            return data?.sort((a, b) => b.total_sales - a.total_sales)
        }

        if (filter === 'newest') {
            return data?.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
        }

        if (filter === 'featured') {
            return data?.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        }

        if (filter === 'price_high_to_low') {
            return data?.sort((a, b) => Number(b.regular_price) - Number(a.regular_price))
        }

        if (filter === 'price_low_to_high') {
            return data?.sort((a, b) => Number(a.regular_price) - Number(b.regular_price))
        }

        return data
    }, [filter, data])

    if (isError) {
        return <ErrorCard />
    }

    if (!filteredProducts) {
        return (
            <div className="grid grid-cols-4 gap-4">
                <Skeleton className="aspect-square flex-shrink-0 flex flex-col lg:flex-1 shadow min-w-[250px] max-w-[150px] lg:max-w-full rounded-xl" />
                <Skeleton className="aspect-square flex-shrink-0 flex flex-col lg:flex-1 shadow min-w-[250px] max-w-[150px] lg:max-w-full rounded-xl" />
                <Skeleton className="aspect-square flex-shrink-0 flex flex-col lg:flex-1 shadow min-w-[250px] max-w-[150px] lg:max-w-full rounded-xl" />
                <Skeleton className="aspect-square flex-shrink-0 flex flex-col lg:flex-1 shadow min-w-[250px] max-w-[150px] lg:max-w-full rounded-xl" />
            </div>
        )
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-row justify-end">
                <Select defaultValue={filter} onValueChange={val => setFilter(val as ProductFilters)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t(`ShopPage.Filters.${filter}`)} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="bestsellers">{t('ShopPage.Filters.bestsellers')}</SelectItem>
                            <SelectItem value="newest">{t('ShopPage.Filters.newest')}</SelectItem>
                            <SelectItem value="price_low_to_high">{t('ShopPage.Filters.price_low_to_high')}</SelectItem>
                            <SelectItem value="price_high_to_low">{t('ShopPage.Filters.price_high_to_low')}</SelectItem>
                            <SelectItem value="featured">{t('ShopPage.Filters.featured')}</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3  gap-3 md:gap-4 lg:gap-6">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}
