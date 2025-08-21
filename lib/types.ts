export interface ProductImage {
  id: number
  image: string
  alt_text?: string
}

export interface ProductVariant {
  id: number;
  title?: string;
  description?: string
  color?: string;
  size?: string;
  price: string;
  stock: number;
  image?: string | null;
  available: boolean;
  variant: string
  images?: ProductImage[]
}

export interface Product {
    id: number;
    title: string;
    description: string
    image: string;
    price: string;
    slug: string;
    stock: number;
    images: ProductImage[]
    available: boolean
    tags: { name: string; slug: string }[]
    average_rating: number
    total_reviews: number
    variants?: ProductVariant[]
    rating_distribution: Record<number, number>
  }
  
  export interface LoggedInUser {
    name : string;
    first_name: string;
    email: string;
    image?: string;
  }

  export interface OrderitemType{
    id: number;
    quantity: number
    price: string 
    total: number
    product: Product
    name: string
  }
  
  export interface OrderType{
    id: number;
    stripe_checkout_id: string;
    payment_method: string;
    total: string;
    items: OrderitemType[];
    payment_status: string;
    created_at: string;
    order_id: string;
  }

  export interface AddressType{
    id: number;
    full_name: string;
    address: string;
    phone: string;
    city: string;
    postal_code: string;
    country: string;
  }

  export interface ShippingAddress {
    id: number
    full_name: string
    address: string
    city: string
    postal_code: string
    country: string
    phone: string
  }

  export interface OrderData {
    id: number
    order_id: string
    shipping_address: ShippingAddress
    items: OrderitemType[]
    total: string
    payment_method: string
    payment_status: string
    expected_delivery: string
    status: string
    created_at: string
    stripe_checkout_id: string | null
    user: number
  }

  export interface CartItem {
    id?: number
    product_id: number
    title: string
    price: string
    image: string
    quantity: number
    variant_id?: number
  }