'use client'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { routes } from '@/utils/routes'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import hero1 from './media/hero-1.webp'
import hero2 from './media/hero-2.webp'

export const Herobanner = () => {
    const [autoPlayPlugin] = React.useState(() => Autoplay({ delay: 4000, stopOnInteraction: true }))
    const [fadePlugin] = React.useState(() => Fade())

    return (
        <Carousel
            opts={{
                align: 'start',
            }}
            plugins={[fadePlugin, autoPlayPlugin]}
            className="w-full"
        >
            <CarouselContent className="min-h-[600px]">
                <CarouselItem>
                    <CarouselImageWrapper src={hero1.src} heading="Lifty" desc="The toddler hipp carrier" />
                </CarouselItem>
                <CarouselItem>
                    <CarouselImageWrapper src={hero2.src} heading="Lifty" desc="The essential for adventures" />
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    )
}

interface CarouselImageWrapperProps {
    src: string
    heading: string
    desc: string
}

const CarouselImageWrapper: React.FC<CarouselImageWrapperProps> = ({ src, heading, desc }) => {
    return (
        <div className="h-full w-dvw relative">
            <div className="absolute left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] bg-zinc-800/40 z-2 w-[100%] h-[100%] flex flex-col justify-center items-center">
                <h1 className="text-8xl text-white text-left font-bold tracking-wide">{heading}</h1>
                <h2 className="text-3xl text-white line-clamp-none text-left mt-2">{desc}</h2>
                <Link href={routes.shop}>
                    <Button size="lg" className="mt-4 px-10 py-6" variant="secondary">
                        <p className="text-2xl">Shop</p>
                    </Button>
                </Link>
            </div>
            <Image
                src={src}
                alt="hero images"
                fill
                fetchPriority="high"
                style={{ maxWidth: '100%', height: '100%', objectFit: 'cover' }}
            />
        </div>
    )
}
