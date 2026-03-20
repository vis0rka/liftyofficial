import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

type FeatureVideoSectionProps = {
    id?: string
    badge?: ReactNode
    title?: ReactNode
    description?: ReactNode
    items?: string[]
    video: ReactNode
    videoWidth: number
    videoHeight: number
    videoPosition?: 'left' | 'right'
    textAlign?: 'left' | 'center'
    primaryCtaLabel?: string
    primaryCtaHref?: string
    secondaryCtaLabel?: string
    secondaryCtaHref?: string
}

export const FeatureVideoSection = ({
    id,
    badge,
    title,
    description,
    items = [],
    video,
    videoWidth,
    videoHeight,
    videoPosition = 'left',
    textAlign = 'left',
    primaryCtaLabel,
    primaryCtaHref,
    secondaryCtaLabel,
    secondaryCtaHref,
}: FeatureVideoSectionProps) => {
    const visibleItems = items.filter(Boolean)
    const isVideoLeft = videoPosition === 'left'
    const isCentered = textAlign === 'center'

    return (
        <section id={id} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                <div className={isVideoLeft ? 'order-2 lg:order-2' : 'order-2 lg:order-1'}>
                    <div className={`max-w-2xl ${isCentered ? 'mx-auto text-center' : ''}`}>
                        {badge ? (
                            <div
                                className={`inline-flex items-center gap-2 rounded-full border border-[#e8ddd3] bg-[#fffaf6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600 ${
                                    isCentered ? 'mx-auto' : ''
                                }`}
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                {badge}
                            </div>
                        ) : null}

                        {title ? (
                            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
                                {title}
                            </h2>
                        ) : null}

                        {description ? (
                            <div
                                className={`mt-6 max-w-xl text-base leading-8 text-neutral-600 ${isCentered ? 'mx-auto' : ''}`}
                            >
                                {description}
                            </div>
                        ) : null}

                        {visibleItems.length > 0 ? (
                            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                {visibleItems.map(item => (
                                    <div
                                        key={item}
                                        className="flex items-start gap-3 rounded-2xl border border-[#eee5dc] bg-white px-4 py-3 text-left text-sm text-neutral-700 shadow-sm"
                                    >
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-neutral-900" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                        {primaryCtaLabel || secondaryCtaLabel ? (
                            <div
                                className={`mt-8 flex flex-col gap-3 sm:flex-row ${isCentered ? 'sm:justify-center' : ''}`}
                            >
                                {primaryCtaLabel ? (
                                    <Link
                                        href={primaryCtaHref}
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
                                    >
                                        {primaryCtaLabel}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                ) : null}
                                {secondaryCtaLabel ? (
                                    <Link
                                        href={secondaryCtaHref}
                                        className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-3.5 text-sm font-medium text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50"
                                    >
                                        {secondaryCtaLabel}
                                    </Link>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className={isVideoLeft ? 'order-1 lg:order-1' : 'order-1 lg:order-2'}>
                    <div className="relative mx-auto flex max-w-xl justify-center">
                        <div className="absolute -left-6 top-8 hidden h-24 w-24 rounded-full bg-[#f1dfd0] blur-2xl lg:block" />
                        <div className="absolute -right-4 bottom-10 hidden h-28 w-28 rounded-full bg-[#dde9e2] blur-2xl lg:block" />

                        <div className="relative w-fit max-w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white p-3 shadow-2xl shadow-neutral-900/10">
                            <div className="relative flex justify-center overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,#e7efe9_0%,#c8dbd0_100%)]">
                                <div className="w-fit max-w-full overflow-hidden rounded-[1.25rem] shadow-xl">
                                    <div
                                        className="max-w-full"
                                        style={{
                                            width: `${videoWidth}px`,
                                            maxWidth: '100%',
                                            aspectRatio: `${videoWidth} / ${videoHeight}`,
                                        }}
                                    >
                                        {video}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
