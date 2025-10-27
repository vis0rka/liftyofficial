import { RecentlyViewed } from '@/components/products/recently-viewed/RecentlyViewed'
import { PageSection } from '@/components/ui/page-section'
import { Separator } from '@/components/ui/separator'
import { CartTable } from '@/moduls/cart/CartTable'

export default async function CartPage() {
    return (
        <PageSection className="space-y-4">
            <div>
                <h1 className="heading-2">Your Cart</h1>
            </div>
            <CartTable />
            <Separator />
            <RecentlyViewed />
        </PageSection>
    )
}
