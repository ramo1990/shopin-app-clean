import { Metadata } from 'next'
import CartClient from './CartClient'


export const metadata: Metadata = {
  title: 'Panier - Shopin',
  description: 'Voir les articles dans votre panier',
}

export default function CartPage() {
  return <CartClient />
}
