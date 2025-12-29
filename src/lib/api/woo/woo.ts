import WooCommerceRestApi, {
    CustomersParams,
    OrdersMainParams,
    ProductsMainParams,
    WooRestApiOptions,
    WooRestApiParams,
} from '@/lib/woo-rest-api/woo-res-apit'
import { ArrayElement } from '@/utils/typeUtils'
import { WooTypes } from './WooTyps'

const opt: WooRestApiOptions = {
    url: 'https://liftyofficial.com',
    consumerKey: process.env.WOO_KEY ?? '',
    consumerSecret: process.env.WOO_SECRET ?? '',
    version: 'wc/v3',
    queryStringAuth: true, // Force Basic Authentication as query string true and using under
}

class WooApi {
    private api: WooCommerceRestApi<WooRestApiOptions>

    constructor(opt: WooRestApiOptions) {
        this.api = new WooCommerceRestApi(opt)
    }
    async getProducts(options: ProductsMainParams): Promise<WooTypes['getProducts']> {
        const response = await this.api.get('products', options as Partial<WooRestApiParams>)
        return response.data
    }

    async getCustomer(email: string): Promise<WooTypes['getCustomers']> {
        const response = await this.api.get('customers', {
            email: email,
        })
        return response.data
    }

    async postCustomer(customer: CustomersParams): Promise<ArrayElement<WooTypes['getCustomers']>> {
        const response = await this.api.post('customers', customer as Partial<WooRestApiParams>)
        return response.data as ArrayElement<WooTypes['getCustomers']>
    }

    async getOrders(options: OrdersMainParams): Promise<WooTypes['getOrders']> {
        const response = await this.api.get('orders', options as Partial<WooRestApiParams>)
        return response.data
    }

    async putOrder(orderId: number, data: OrdersMainParams): Promise<any> {
        const response = await this.api.put('orders', data, { id: orderId } as Partial<WooRestApiParams>)
        return response
    }

    async postOrder(language: string, data: Record<string, unknown>): Promise<any> {
        const response = await this.api.postOrderOnLanguage(language, 'orders', data)
        return response
    }
}

export const wooApi = new WooApi(opt)
