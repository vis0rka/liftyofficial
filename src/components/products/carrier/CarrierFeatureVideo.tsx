'use client'

type CarrierFeatureVideoProps = {
    className?: string
    width?: number
    height?: number
}

export const CarrierFeatureVideo = ({ className, width = 400, height = 1200 }: CarrierFeatureVideoProps) => {
    return (
        <iframe
            width={width}
            height={height}
            src="https://www.youtube.com/embed/QBzpjMYTM5I?autoplay=1&mute=1&playlist=QBzpjMYTM5I&loop=1"
            title="Lifty - Toddler hip carrier - 2"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className={className}
            allowFullScreen={true}
        />
    )
}

export const TravelEssentialFeatureVideo = ({ className, width = 337, height = 599 }: CarrierFeatureVideoProps) => {
    return (
        <iframe
            width={width}
            height={height}
            src="https://www.youtube.com/embed/FiOGCkpca30?autoplay=1&mute=1&playlist=QBzpjMYTM5I&loop=1"
            title="Lifty - Toddler hip carrier - 2"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className={className}
            allowFullScreen={true}
        />
    )
}
