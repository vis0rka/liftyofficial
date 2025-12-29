export interface WooTypes {
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
