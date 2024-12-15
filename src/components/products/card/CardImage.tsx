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

    const imageSrc = hovered ? productImages[1]?.src || productImages[0].src : productImages[0].src
    const imageAlt = hovered ? productImages[1]?.alt || productImages[0].alt : productImages[0].alt

    return (
        <Image
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            src={imageSrc}
            width={600}
            height={600}
            style={{
                objectFit: 'contain',
            }}
            alt={imageAlt}
        />
    )
}
