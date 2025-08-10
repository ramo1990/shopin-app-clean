"use client"

import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import { useCartContext } from '@/context/CartContext'
// import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'


const CartClient = () => {
  const { cart } = useCartContext()
  // const { data: session } = useSession()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) return null // ou un loader

  if (cart.length === 0) {
    return (
      <section className="flex items-center justify-center min-h-[60vh] bg-gray-50 px-4">
        <div className="max-w-xl text-center space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Votre panier est vide</h1>
          <p className="text-gray-600">Vous n’avez ajouté aucun article pour le moment.</p>

          <Link href='/' className='inline-block bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition'>
            Retour à l’accueil
          </Link>
        </div>
      </section>
    )
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h1 className='text-3xl font-bold text-gray-900 mb-10 text-center lg:text-left'>Mon Panier</h1>

      <div className='flex flex-col lg:flex-row gap-10'>
        {/* Liste des articles */}
        <div className='flex-1'>
          <div className='max-h-[500px] overflow-y-auto space-y-6 pr-2 custom-scrollbar'>
            {cart.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Résumé du panier */}
        <aside className='w-full lg:w-[350px] bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm'>
          <CartSummary />
        </aside>
      </div>
    </div>
  )
}

export default CartClient
