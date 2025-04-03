import { persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

export interface ICartItem {
    name: string
    sku: string
    id: string
    price: number
    currency: string
    image: string
    slug: string
    quantity: number
    product_data: {
        metadata: {
            type: string
        }
    }
    custom_prices: {
        PLN: string
        BGN: string
        CZK: string
        DKK: string
        RON: string
        SEK: string
        EUR: string
    }
}

type CartStoreState = {
    items: ICartItem[]
    shouldDisplayCart: boolean
    totalPrice: number
}

type CartStoreActions = {
    addItem: (item: ICartItem) => void
    removeItem: (id: string) => void
    incrementItemQuantity: (id: string) => void
    decrementItemQuantity: (id: string) => void
    toggleCart: () => void
    handleOpenCart: () => void
    handleCloseCart: () => void
    changeCurrency: (currency: string) => void
}

const defaultInitalState: CartStoreState = {
    items: [],
    shouldDisplayCart: false,
    totalPrice: 0,
}

export type CartStore = CartStoreState & CartStoreActions

export const createCartStore = (initState: CartStoreState = defaultInitalState) =>
    createStore<CartStore>()(
        persist(
            set => ({
                ...initState,
                // Add a new item to the cart or update the quantity if it exists
                addItem: newItem => {
                    set(state => {
                        const itemExists = state.items.find(item => item.id === newItem.id)
                        let updatedItems
                        if (itemExists) {
                            // Update quantity if item already exists
                            updatedItems = state.items.map(item =>
                                item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item,
                            )
                        } else {
                            // Otherwise add the new item
                            updatedItems = [...state.items, newItem]
                        }
                        const totalPrice = updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
                        return { items: updatedItems, totalPrice }
                    })
                },

                // Remove an item from the cart by its id
                removeItem: id => {
                    set(state => {
                        const updatedItems = state.items.filter(item => item.id !== id)
                        const totalPrice = updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
                        return { items: updatedItems, totalPrice }
                    })
                },

                // Increase the quantity of an item by its id
                incrementItemQuantity: id => {
                    set(state => {
                        const updatedItems = state.items.map(item =>
                            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
                        )
                        const totalPrice = updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
                        return { items: updatedItems, totalPrice }
                    })
                },

                // Decrease the quantity of an item by its id; remove the item if quantity goes to 0
                decrementItemQuantity: id => {
                    set(state => {
                        const updatedItems = state.items
                            .map(item => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
                            .filter(item => item.quantity > 0)
                        const totalPrice = updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
                        return { items: updatedItems, totalPrice }
                    })
                },

                // Toggle the visibility of the cart
                toggleCart: () => set(state => ({ shouldDisplayCart: !state.shouldDisplayCart })),

                handleCloseCart: () => set(() => ({ shouldDisplayCart: false })),
                handleOpenCart: () => set(() => ({ shouldDisplayCart: true })),
                changeCurrency: (currency: string) => {
                    set(state => {
                        const updatedItems = state.items.map(item => {
                            if (item.custom_prices && item.custom_prices[currency]) {
                                return {
                                    ...item,
                                    price: Number(item.custom_prices[currency]),
                                    currency: currency,
                                }
                            }
                            // If no custom price exists for the provided currency, keep the item as is
                            return item
                        })
                        const totalPrice = updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
                        return { items: updatedItems, totalPrice }
                    })
                },
            }),
            {
                name: 'cart-storage',
            },
        ),
    )
