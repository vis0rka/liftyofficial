'use server'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WooTypes } from '@/lib/api/woo/WooTyps'
import { getTranslations } from 'next-intl/server'
import { Fragment } from 'react'

interface AccountMenuProps {
    user: WooTypes['getCustomers'][0]
    orders: WooTypes['getOrders']
}

export async function AccountMenu({ user, orders }: AccountMenuProps) {
    const t = await getTranslations('Account')
    return (
        <div className="flex w-full max-w-md flex-col gap-6">
            <Tabs defaultValue="account" orientation="vertical" className="max-w-lg">
                {/* Left Sidebar */}
                <TabsList>
                    <TabsTrigger value="account">{t('account')}</TabsTrigger>
                    <TabsTrigger value="orders">{t('orders')}</TabsTrigger>
                </TabsList>

                {/* Right Content */}
                <div className="flex-1">
                    <TabsContent value="account" className="mt-0">
                        <AccountContent user={user} />
                    </TabsContent>
                    <TabsContent value="orders" className="mt-0">
                        <OrdersContent orders={orders} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

async function AccountContent({ user }: { user: AccountMenuProps['user'] }) {
    const t = await getTranslations('Account')

    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle>{t('account_details')}</CardTitle>
                <CardDescription>{t('manage_your_account_details')}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm font-medium text-muted-foreground">{t('email')}</p>
                <p className="text-lg">{user.email}</p>
                <p className="text-sm font-medium text-muted-foreground">{t('first_name')}</p>
                <p className="text-lg">{user.billing?.first_name}</p>
                <p className="text-sm font-medium text-muted-foreground">{t('last_name')}</p>
                <p className="text-lg">{user.billing?.last_name}</p>
                <p className="text-sm font-medium text-muted-foreground">{t('phone')}</p>
                <p className="text-lg">{user.billing?.phone}</p>
                <p className="text-sm font-medium text-muted-foreground">{t('address')}</p>
                <p className="text-lg">{user.billing?.address_1}</p>
                <p className="text-sm font-medium text-muted-foreground">{t('city')}</p>
                <p className="text-lg">{user.billing?.city}</p>
                <p className="text-sm font-medium text-muted-foreground">{t('state')}</p>
                <p className="text-lg">{user.billing?.state}</p>
                <p className="text-sm font-medium text-muted-foreground">{t('postal_code')}</p>
                <p className="text-lg">{user.billing?.postcode}</p>
                <p className="text-sm font-medium text-muted-foreground">{t('country')}</p>
                <p className="text-lg">{user.billing?.country}</p>
            </CardContent>
        </Card>
    )
}

async function OrdersContent({ orders }: { orders: AccountMenuProps['orders'] }) {
    const t = await getTranslations('Account')
    return (
        <Card className="p-4">
            <CardHeader className="hidden">
                <CardTitle>{t('your_orders')}</CardTitle>
            </CardHeader>
            <CardContent>
                {!orders || orders.length === 0 ? (
                    <p className="text-muted-foreground">{t('no_orders_found')}</p>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order: any) => (
                            <Fragment key={order.id}>
                                <div className=" p-4 space-y-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-medium">
                                                {t('order_number')} #{order.number}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(order.date_created).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <p className="font-medium">{order.total}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground capitalize">{t('order_status')}:</p>
                                        <p className="text-sm capitalize">{order.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground capitalize">{t('order_items')}:</p>
                                        {order.line_items.map((item: any) => (
                                            <div key={item.id} className="flex justify-between items-center">
                                                <p className="text-sm  capitalize">{item.name}</p>
                                                <p className="text-sm  capitalize">{item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            {t('shipping_address')}:
                                        </p>
                                        <p className="text-sm capitalize ">
                                            {order.shipping.first_name} {order.shipping.last_name}
                                        </p>

                                        <p className="text-sm capitalize ">{order.shipping.address_1}</p>
                                        <p className="text-sm capitalize">{order.shipping.address_2}</p>
                                        <p className="text-sm capitalize">{order.shipping.city}</p>
                                        <p className="text-sm capitalize">{order.shipping.state}</p>
                                        <p className="text-sm capitalize">{order.shipping.postcode}</p>
                                        <p className="text-sm capitalize">{order.shipping.country}</p>
                                    </div>
                                </div>
                                <Separator />
                            </Fragment>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
