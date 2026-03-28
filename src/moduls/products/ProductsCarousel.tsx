'use client'
import { ProductCard } from '@/components/products/card/ProductCard'
import { Card } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { WooTypes } from '@/lib/api/woo/WooTyps'
import { cn } from '@/lib/utils'
import { ArrayElement } from '@/utils/typeUtils'

interface ProductCarouselProps {
    products: ArrayElement<WooTypes['getProducts']>[]
}

export const ProductCarousel = ({ products }: ProductCarouselProps) => {
    return (
        <div className="w-dvw">
            <Carousel
                opts={{
                    align: 'start',
                    loop: false,
                }}
                className="w-full"
            >
                <CarouselContent className={cn('py-2')}>
                    {products.map(product => (
                        <CarouselItem
                            key={product.id}
                            className={cn(
                                'basis-[65%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5',
                                'max-w-[20rem]',
                            )}
                        >
                            <Card className="w-full overflow-hidden shadow-sm">
                                <ProductCard product={product} hideViewButton />
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}
