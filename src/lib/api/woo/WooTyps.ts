export interface WooTypes {
    ProductParams: {
        /**
         * Scope under which the request is made; determines fields present in response.
         * @default 'view'
         */
        context?: 'view' | 'edit'

        /**
         * Current page of the collection.
         * @default 1
         */
        page?: number

        /**
         * Maximum number of items to be returned in result set.
         * @default 10
         */
        per_page?: number

        /**
         * Limit results to those matching a string.
         */
        search?: string

        /**
         * Fields to search when used with search parameter.
         */
        search_fields?: Array<'name' | 'sku' | 'global_unique_id' | 'description' | 'short_description'>

        /**
         * Limit response to resources published after a given ISO8601 compliant date.
         */
        after?: string

        /**
         * Limit response to resources published before a given ISO8601 compliant date.
         */
        before?: string

        /**
         * Limit response to resources modified after a given ISO8601 compliant date.
         */
        modified_after?: string

        /**
         * Limit response to resources modified before a given ISO8601 compliant date.
         */
        modified_before?: string

        /**
         * Whether to interpret dates as GMT when limiting response by published or modified date.
         */
        dates_are_gmt?: boolean

        /**
         * Ensure result set excludes specific IDs.
         */
        exclude?: number[]

        /**
         * Limit result set to specific IDs.
         */
        include?: number[]

        /**
         * Offset the result set by a specific number of items.
         */
        offset?: number

        /**
         * Order sort attribute ascending or descending.
         * @default 'desc'
         */
        order?: 'asc' | 'desc'

        /**
         * Sort collection by object attribute.
         * @default 'date'
         */
        orderby?:
            | 'date'
            | 'modified'
            | 'id'
            | 'include'
            | 'title'
            | 'slug'
            | 'price'
            | 'popularity'
            | 'rating'
            | 'menu_order'

        /**
         * Limit result set to those of particular parent IDs.
         */
        parent?: number[]

        /**
         * Limit result set to all items except those of particular parent IDs.
         */
        parent_exclude?: number[]

        /**
         * Limit result set to products with a specific slug.
         */
        slug?: string

        /**
         * Limit result set to products assigned a specific status.
         * @default 'any'
         */
        status?: 'any' | 'draft' | 'pending' | 'private' | 'publish'

        /**
         * Limit result set to products with any of the specified statuses.
         * Multiple statuses can be provided as a comma-separated list.
         */
        include_status?: string

        /**
         * Exclude products from result set with any of the specified statuses.
         * Multiple statuses can be provided as a comma-separated list.
         */
        exclude_status?: string

        /**
         * Limit result set to products assigned a specific type.
         */
        type?: 'simple' | 'grouped' | 'external' | 'variable'

        /**
         * Limit result set to products with any of the specified types.
         * Multiple types can be provided as a comma-separated list.
         */
        include_types?: string

        /**
         * Exclude products from result set with any of the specified types.
         * Multiple types can be provided as a comma-separated list.
         */
        exclude_types?: string

        /**
         * Limit result set to products with a specific SKU.
         */
        sku?: string

        /**
         * Limit result set to featured products.
         */
        featured?: boolean

        /**
         * Limit result set to products assigned a specific category ID.
         */
        category?: string

        /**
         * Limit result set to products assigned a specific tag ID.
         */
        tag?: string

        /**
         * Limit result set to products assigned a specific shipping class ID.
         */
        shipping_class?: string

        /**
         * Limit result set to products with a specific attribute.
         */
        attribute?: string

        /**
         * Limit result set to products with a specific attribute term ID.
         */
        attribute_term?: string

        /**
         * Limit result set to products with a specific tax class.
         */
        tax_class?: 'standard' | 'reduced-rate' | 'zero-rate' | string

        /**
         * Limit result set to products on sale.
         */
        on_sale?: boolean

        /**
         * Limit result set to products based on a minimum price.
         */
        min_price?: string

        /**
         * Limit result set to products based on a maximum price.
         */
        max_price?: string

        /**
         * Limit result set to products with specified stock status.
         */
        stock_status?: 'instock' | 'outofstock' | 'onbackorder'

        /**
         * Limit result set to virtual products.
         */
        virtual?: boolean

        /**
         * Limit result set to downloadable products.
         */
        downloadable?: boolean
    }
    getProducts: {
        id: number
        name: string
        slug: string
        permalink: string
        date_created: string
        date_created_gmt: string
        date_modified: string
        date_modified_gmt: string
        type: string
        status: string
        featured: boolean
        catalog_visibility: string
        description: string
        short_description: string
        sku: string
        price: string
        regular_price: string
        sale_price: string
        date_on_sale_from: any
        date_on_sale_from_gmt: any
        date_on_sale_to: any
        date_on_sale_to_gmt: any
        on_sale: boolean
        purchasable: boolean
        total_sales: number
        virtual: boolean
        downloadable: boolean
        downloads: any[]
        download_limit: number
        download_expiry: number
        external_url: string
        button_text: string
        tax_status: string
        tax_class: string
        manage_stock: boolean
        stock_quantity: any
        backorders: string
        backorders_allowed: boolean
        backordered: boolean
        low_stock_amount: any
        sold_individually: boolean
        weight: string
        dimensions: {
            length: string
            width: string
            height: string
        }
        shipping_required: boolean
        shipping_taxable: boolean
        shipping_class: string
        shipping_class_id: number
        reviews_allowed: boolean
        average_rating: string
        rating_count: number
        upsell_ids: any[]
        cross_sell_ids: any[]
        parent_id: number
        purchase_note: string
        categories: { id: number; name: string; slug: string }[]
        tags: { id: number; name: string; slug: string }[]
        images: {
            id: number
            date_created: string
            date_created_gmt: string
            date_modified: string
            date_modified_gmt: string
            src: string
            name: string
            alt: string
        }[]
        attributes: any[]
        default_attributes: any[]
        variations: any[]
        grouped_products: any[]
        menu_order: number
        price_html: string
        related_ids: any[]
        meta_data: { id: number; key: string; value: any }[]
        stock_status: string
        has_options: boolean
        post_password: string
        global_unique_id: string
        _links: {
            self: { href: string; targetHints: { allow: string[] } }[]
            collection: { href: string }[]
        }
        custom_prices?: string
    }[]
    getCustomers: {
        id: number
        email: string
        first_name: string
        last_name: string
        billing: {
            first_name: string
            last_name: string
            company: string
            address_1: string
            address_2: string
            city: string
            postcode: string
            country: string
            state: string
            email: string
            phone: string
        }
        shipping: {
            first_name: string
            last_name: string
            company: string
            address_1: string
            address_2: string
            city: string
            postcode: string
            country: string
            state: string
            phone: string
        }
    }[]

    getOrders: Array<{
        id: number
        parent_id: number
        status: string
        currency: string
        version: string
        prices_include_tax: boolean
        date_created: string
        date_modified: string
        discount_total: string
        discount_tax: string
        shipping_total: string
        shipping_tax: string
        cart_tax: string
        total: string
        total_tax: string
        customer_id: number
        order_key: string
        billing: {
            first_name: string
            last_name: string
            company: string
            address_1: string
            address_2: string
            city: string
            state: string
            postcode: string
            country: string
            email: string
            phone: string
        }
        shipping: {
            first_name: string
            last_name: string
            company: string
            address_1: string
            address_2: string
            city: string
            state: string
            postcode: string
            country: string
            phone: string
        }
        payment_method: string
        payment_method_title: string
        transaction_id: string
        customer_ip_address: string
        customer_user_agent: string
        created_via: string
        customer_note: string
        date_completed: any
        date_paid: string
        cart_hash: string
        number: string
        meta_data: Array<any>
        line_items: Array<{
            id: number
            name: string
            product_id: number
            variation_id: number
            quantity: number
            tax_class: string
            subtotal: string
            subtotal_tax: string
            total: string
            total_tax: string
            taxes: Array<{
                id: number
                total: string
                subtotal: string
            }>
            meta_data: Array<{
                id: number
                key: string
                value: string
                display_key: string
                display_value: string
            }>
            sku: string
            price: number
            image: {
                id: string
                src: string
            }
            parent_name: any
        }>
        tax_lines: Array<{
            id: number
            rate_code: string
            rate_id: number
            label: string
            compound: boolean
            tax_total: string
            shipping_tax_total: string
            rate_percent: number
            meta_data: Array<any>
        }>
        shipping_lines: Array<any>
        fee_lines: Array<any>
        coupon_lines: Array<any>
        refunds: Array<any>
        payment_url: string
        is_editable: boolean
        needs_payment: boolean
        needs_processing: boolean
        date_created_gmt: string
        date_modified_gmt: string
        date_completed_gmt: any
        date_paid_gmt: string
        currency_symbol: string
        _links: {
            self: Array<{
                href: string
                targetHints: {
                    allow: Array<string>
                }
            }>
            collection: Array<{
                href: string
            }>
        }
    }>
}
