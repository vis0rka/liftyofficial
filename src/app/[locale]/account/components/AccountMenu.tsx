'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AccountMenuProps {
    user: any
    orders: any
}

export function AccountMenu({ user, orders }: AccountMenuProps) {
    return (
        <div className="flex w-full max-w-sm flex-col gap-6">
            <Tabs defaultValue="account" orientation="vertical" className="max-w-lg">
                {/* Left Sidebar */}
                <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
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

function AccountContent({ user }: { user: any }) {
    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{user.email}</p>
                <p className="text-sm font-medium text-muted-foreground">Username</p>
                <p className="text-lg">{user.username}</p>
                <p className="text-sm font-medium text-muted-foreground">First Name</p>
                <p className="text-lg">{user.first_name}</p>
                <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                <p className="text-lg">{user.last_name}</p>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-lg">{user.phone}</p>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="text-lg">{user.address}</p>
                <p className="text-sm font-medium text-muted-foreground">City</p>
                <p className="text-lg">{user.city}</p>
                <p className="text-sm font-medium text-muted-foreground">State</p>
                <p className="text-lg">{user.state}</p>
                <p className="text-sm font-medium text-muted-foreground">Postal Code</p>
                <p className="text-lg">{user.postal_code}</p>
                <p className="text-sm font-medium text-muted-foreground">Country</p>
                <p className="text-lg">{user.country}</p>
            </CardContent>
        </Card>
    )
}

function OrdersContent({ orders }: { orders: any }) {
    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle>Your Orders</CardTitle>
            </CardHeader>
            <CardContent>
                {!orders || orders.length === 0 ? (
                    <p className="text-muted-foreground">No orders found.</p>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order: any) => (
                            <div key={order.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-medium">Order #{order.number}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(order.date_created).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className="font-medium">{order.total}</p>
                                </div>
                                <p className="text-sm text-muted-foreground capitalize">Status: {order.status}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
