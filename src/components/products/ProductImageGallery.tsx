'use client'

import { WooTypes } from '@/lib/api/woo/WooTyps'
import { cn } from '@/lib/utils'
import { ArrayElement } from '@/utils/typeUtils'
import Image from 'next/image'
import { parseAsInteger, useQueryState } from 'nuqs'
import ImageViewer from '../features/ImageViewer'
import { Button } from '../ui/button'

interface Props {
    images: ArrayElement<WooTypes['getProducts']>['images']
    className?: string
}

export const ProductImageGallery: React.FC<Props> = ({ images, className }) => {
    const [image, setImage] = useQueryState('image', parseAsInteger.withDefault(0))

    return (
        <div className={cn('', className)}>
            <div className="relative aspect-square h-auto w-auto shadow-md rounded-xl overflow-hidden shrink border ">
                {images[image] && <ImageViewer src={images[image].src} alt="product-image" />}
            </div>
            {images.length > 1 ? (
                <ul className="mt-4 flex items-center justify-center gap-2  lg:mb-0 overflow-hidden">
                    {images.map((image, index) => {
                        return (
                            <li key={image.src} className="h-25 w-25">
                                <Button
                                    variant="ghost"
                                    onClick={() => setImage(index)}
                                    aria-label="Enlarge product image"
                                    className="h-full w-full relative p-0 m-0 rounded-sm overflow-hidden shadow border"
                                >
                                    <Image src={image.src} fill alt={image.alt} />
                                </Button>
                            </li>
                        )
                    })}
                </ul>
            ) : null}
        </div>
    )
}
