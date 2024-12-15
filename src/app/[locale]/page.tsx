'use server'
import { Herobanner } from '@/components/herobanner/Herobanner'
import { KeyFeatures } from '@/components/moduls/key-features/KeyFeatures'
import { BestSellersProducts } from '@/components/products/bestsellers/BestSellersProducts'
import Image from 'next/image'

export default async function HomePage() {
    return (
        <div className="space-y-8">
            <Herobanner />
            <div className="container mx-auto flex flex-col space-y-10">
                <BestSellersProducts />

                <section className="m-w-[600px] mx-auto px-4">
                    <div className="flex flex-col justify-center items-center lg:space-x-12 space-y-10 lg:flex-row">
                        <div className="w-full space-y-4 flex flex-col items-center justify-center lg:w-1/2">
                            <h1 className="text-4xl text-center">When might you need it?</h1>
                            <p className="text-center">
                                Anytime and anywhere! It provides ideal support for short distances, like when you need
                                to carry your toddler up the stairs in a building without an elevator, or when you're
                                accompanying the “big sibling” to kindergarten or school. You'll also love it during
                                vacations, from the airport all the way to the sandy beach, where strollers can no
                                longer manage. It's small enough to take anywhere, yet big enough to enhance the bonding
                                experience between you and your child.
                            </p>
                        </div>
                        <div className="lg:w-1/2 flex justify-center items-center">
                            <Image
                                src="/images/lifty-autumn-arrow-fan.webp"
                                width={600}
                                height={600}
                                alt="lifty-toddler-carrier-autumn"
                                style={{
                                    objectFit: 'contain',
                                }}
                            />
                        </div>
                    </div>
                </section>
                <section className="px-4">
                    <KeyFeatures />
                </section>
            </div>
        </div>
    )
}
