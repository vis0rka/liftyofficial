import { CartTable } from '@/components/moduls/cart/CartTable'

export default async function CartPage() {
    return (
        <section className="container mx-auto flex flex-col my-10 space-y-4">
            <div>
                <h1 className="~text-xl/4xl">Your Cart</h1>
            </div>
            <CartTable />
        </section>
    )
}
