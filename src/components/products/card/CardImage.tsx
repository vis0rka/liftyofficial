'use client'
import { WooTypes } from '@/lib/api/woo/WooTyps'
import { ArrayElement } from '@/utils/typeUtils'
import Image from 'next/image'
import React, { useState } from 'react'

interface CardImageProps {
    productImages: ArrayElement<WooTypes['getProducts']>['images']
}

export const CardImage: React.FC<CardImageProps> = ({ productImages }) => {
    const [hovered, setHovered] = useState(false)
    const hasSecondImage = productImages && productImages.length > 1 && productImages[1]?.src

    const primaryImage = productImages[0]?.src
    const secondaryImage = hasSecondImage ? productImages[1]?.src : null
    const primaryAlt = productImages[0]?.alt || ''
    const secondaryAlt = productImages[1]?.alt || primaryAlt

    return (
        <div
            className="relative overflow-hidden w-full aspect-square"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                    hovered && hasSecondImage ? 'opacity-0' : 'opacity-100'
                }`}
            >
                <Image
                    src={primaryImage}
                    width={600}
                    height={600}
                    className="w-full h-full object-contain transition-transform duration-500 ease-in-out hover:scale-105"
                    alt={primaryAlt}
                />
            </div>
            {hasSecondImage && secondaryImage && (
                <div
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                        hovered ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <Image
                        src={secondaryImage}
                        width={600}
                        height={600}
                        className="w-full h-full object-contain transition-transform duration-500 ease-in-out scale-105"
                        alt={secondaryAlt}
                    />
                </div>
            )}
        </div>
    )
}
