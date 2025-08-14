import { queryOptions } from '@tanstack/react-query'
import { getProducts } from './getProducts'

const PRODUCT_QUERY_KEYS = {
    products: 'products',
}

export const productQueryOption = queryOptions({
    queryKey: [PRODUCT_QUERY_KEYS.products],
    queryFn: async () => {
        const response = await getProducts()
        console.log(response)
        return response
    },
})
