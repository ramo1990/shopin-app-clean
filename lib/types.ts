// types.ts
export interface Product {
    id: number;
    title: string;
    description: string
    image: string;
    price: string;
    slug: string;
    stock: number;
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