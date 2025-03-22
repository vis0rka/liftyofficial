'use client'

import { WooTypes } from '@/lib/api/woo/WooTyps'
import { ArrayElement } from '@/utils/typeUtils'
import Image from 'next/image'
import { parseAsInteger, useQueryState } from 'nuqs'
import ImageViewer from '../features/ImageViewer'
import { Button } from '../ui/button'

interface Props {
    images: ArrayElement<WooTypes['getProducts']>['images']
}

export const ProductImageGallery: React.FC<Props> = ({ images }) => {
    const [image, setImage] = useQueryState('image', parseAsInteger.withDefault(0))

    return (
        <div className="basis-1/2">
            <div className="relative aspect-square h-auto w-auto shadow-md rounded-xl overflow-hidden shrink">
                {images[image] && <ImageViewer src={images[image].src} alt="product-image" />}
            </div>

            {images.length > 1 ? (
                <ul className="my-12 flex items-center justify-center gap-2 py-1 lg:mb-0 overflow-hidden">
                    {images.map((image, index) => {
                        return (
                            <li key={image.src} className="h-50 w-50">
                                <Button
                                    variant="ghost"
                                    onClick={() => setImage(index)}
                                    aria-label="Enlarge product image"
                                    className="h-full w-full p-0 m-0 rounded-sm overflow-hidden shadow border-neutral-200 border"
                                >
                                    <Image src={image.src} width={100} height={100} alt={image.alt} />
                                </Button>
                            </li>
                        )
                    })}
                </ul>
            ) : null}
        </div>
    )
}
