'use client'

// import { auth } from '@/auth'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import React from 'react'
import { useCartContext } from '@/context/CartContext'
import Link from 'next/link'


// interface CartPageProps {
//   // params: { cartcode: string }
// }

export default /*async*/ function CartitemPage() {
  const { cart } = useCartContext()
  // const cartCode = params.cartcode
  // const session = await auth()
  // const loggedInUser = session?.user?.email || null

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h1 className='text-3xl font-bold text-gray-900 mb-10 text-center lg:text-left'>Mon Panier</h1>

      <div className='flex flex-col lg:flex-row gap-10'>
        {/* Liste des articles */}
        <section className='flex-1'>
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-10 space-y-4" aria-live="polite">
              <p>Votre panier est vide</p>
              <Link href="/" className="inline-block px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
              Retour à la boutique
              </Link>
            </div>
          ) : (
            <div className='overflow-y-auto space-y-6 pr-2 custom-scrollbar'style={{ maxHeight: 'calc(100vh - 300px)' }}
            aria-label="Articles du panier défilants">
              {cart.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* Résumé du panier */}
        <aside className='w-full lg:w-[350px] bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm' aria-label="Résumé de la commande">
          <CartSummary />
        </aside>
      </div>
    </main>
  )
}