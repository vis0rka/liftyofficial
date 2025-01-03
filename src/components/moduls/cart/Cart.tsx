import { Button } from '@/components/ui/button'
import { CartSheetContent, Sheet, SheetTrigger } from '@/components/ui/sheet'
import { ShoppingCart } from 'lucide-react'
import React from 'react'

export const Cart: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="icon" size="icon" aria-label="Shopping Cart">
                    <ShoppingCart className="h-8 w-8" />
                </Button>
            </SheetTrigger>
            <CartSheetContent side="right" className="h-full"></CartSheetContent>
        </Sheet>
    )
}
