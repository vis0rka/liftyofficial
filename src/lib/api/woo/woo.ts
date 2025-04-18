import WooCommerceRestApi, { WooRestApiOptions } from '@/lib/woo-rest-api/woo-res-apit'

const opt: WooRestApiOptions = {
    url: 'https://liftyofficial.com',
    consumerKey: process.env.WOO_KEY ?? '',
    consumerSecret: process.env.WOO_SECRET ?? '',
    version: 'wc/v3',
    queryStringAuth: true, // Force Basic Authentication as query string true and using under
}
export const wooApi = new WooCommerceRestApi(opt)
