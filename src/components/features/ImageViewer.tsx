'use client'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import Image from 'next/image'
import { useState } from 'react'

interface ImageViewerProps {
    src: string
    alt: string
    width: number
    height: number
}

export default function ImageViewer({ src, alt, width, height }: ImageViewerProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                onClick={() => setIsOpen(true)}
                className="cursor-pointer transition-transform hover:scale-105"
            />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <VisuallyHidden.Root>
                    <DialogTitle>product images</DialogTitle>
                </VisuallyHidden.Root>
                <DialogContent className="h-full w-full max-w-[90vw] max-h-[90vh] p-0">
                    <div className="relative w-full h-full">
                        <Image src={src} alt={alt} fill style={{ objectFit: 'contain' }} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
