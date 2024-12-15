'use client'

import { Menu, ShoppingCart, X } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Image from 'next/image'
import { MobileMenuDialog, MobileMenuDialogContent, MobileMenuDialogTrigger } from './components/mobileMenuDialog'

const menuItems = [
    { title: 'Home', href: '/' },
    { title: 'Shop', href: '/shop' },
]

export function Header() {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="container flex h-14 items-center justify-between mx-auto">
                <div className="flex items-center md:w-1/3">
                    <MobileMenuDialog open={isOpen} onOpenChange={setIsOpen}>
                        <MobileMenuDialogTrigger asChild>
                            <Button
                                variant="icon"
                                size="icon"
                                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                            >
                                <div className="relative">
                                    <Menu
                                        className={`h-5 w-5 transition-all ${
                                            isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                                        }`}
                                    />
                                    <X
                                        className={`absolute left-0 top-0 h-5 w-5 transition-all ${
                                            isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                                        }`}
                                    />
                                </div>
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </MobileMenuDialogTrigger>
                        <MobileMenuDialogContent className="w-full m-w-full h-full top-[3.5rem] translate-y-0 p-4">
                            <MobileNav items={menuItems} setIsOpen={setIsOpen} />
                        </MobileMenuDialogContent>
                    </MobileMenuDialog>
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/images/logo-small.webp"
                            width={120}
                            height={0}
                            alt="lifty-logo"
                            style={{
                                objectFit: 'contain',
                                maxWidth: '100%',
                                height: 'auto',
                            }}
                            className="w-16 md:w-20 lg:w-24"
                        />
                    </Link>
                </div>
                <div className="hidden md:flex md:w-1/3 md:justify-center">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {menuItems.map(item => (
                                <NavigationMenuItem key={item.title}>
                                    <Link href={item.href} legacyBehavior passHref>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            {item.title}
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="flex items-center justify-end md:w-1/3">
                    <Cart />
                </div>
            </div>
        </header>
    )
}

interface MobileNavProps {
    items: { title: string; href: string }[]
    setIsOpen: (open: boolean) => void
}

function MobileNav({ items, setIsOpen }: MobileNavProps) {
    return (
        <nav className="flex flex-col space-y-3">
            {items.map((item, index) => (
                <React.Fragment key={item.title}>
                    <Link
                        href={item.href}
                        className="text-foreground/70 transition-colors hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                    >
                        {item.title}
                    </Link>
                    {index < items.length - 1 && <Separator />}
                </React.Fragment>
            ))}
        </nav>
    )
}

const Cart: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="icon" size="icon" aria-label="Shopping Cart">
                    <ShoppingCart className="h-8 w-8" />
                </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-full mt-14">
                <h1>cart</h1>
            </SheetContent>
        </Sheet>
    )
}
