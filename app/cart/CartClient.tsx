"use client"

import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import { useCartContext } from '@/context/CartContext'
// import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'


const CartClient = () => {
  const { cart } = useCartContext()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    console.log('CartClient : fetchCart appelé');
    setHydrated(true)
  }, [])

  // Loader de skeleton avant hydratation
  if (!hydrated){
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  console.log('CartClient rendu - cart:', cart);

  // Panier vide
  if (cart.length === 0) {
    return (
      <section aria-label="Panier vide" className="flex items-center justify-center min-h-[60vh] bg-gray-50 px-4">
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

  // Panier avec produits
  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h1 className='text-3xl font-bold text-gray-900 mb-10 text-center lg:text-left'>Mon Panier</h1>

      <div className='flex flex-col lg:flex-row gap-10'>
        {/* Liste des articles */}
        <section className='flex-1' aria-label="Articles du panier">
          <div className='overflow-y-auto space-y-6 pr-2 custom-scrollbar'>
            {cart.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Résumé du panier */}
        <aside className='w-full lg:w-[350px] bg-gray-50 border border-gray-300 rounded-lg p-6 shadow-md' aria-label="Résumé de la commande">
          <CartSummary />
        </aside>
      </div>
    </main>
  )
}

export default CartClient
