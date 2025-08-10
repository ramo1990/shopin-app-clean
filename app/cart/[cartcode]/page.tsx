'use client'

// import { auth } from '@/auth'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import React from 'react'
import { useCartContext } from '@/context/CartContext'


// interface CartPageProps {
//   // params: { cartcode: string }
// }

export default /*async*/ function CartitemPage() {
  const { cart } = useCartContext()
  // const cartCode = params.cartcode
  // const session = await auth()
  // const loggedInUser = session?.user?.email || null

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h1 className='text-3xl font-bold text-gray-900 mb-10 text-center lg:text-left'>Mon Panier</h1>

      <div className='flex flex-col lg:flex-row gap-10'>
        {/* Liste des articles */}
        <div className='flex-1'>
          {cart.length === 0 ? (
            <p className='text-center text-gray-500 py-10'>Votre panier est vide</p>
          ) : (
            <div className='max-h-[500px] overflow-y-auto space-y-6 pr-2 custom-scrollbar'>
              {cart.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Résumé du panier */}
        <aside className='w-full lg:w-[350px] bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm'>
          <CartSummary />
        </aside>
      </div>
    </div>
  )
}