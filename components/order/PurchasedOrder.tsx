import React from 'react'
import OrderContainer from './OrderContainer'
import { OrderType } from '@/lib/types'

const PurchasedOrder = ({ orders }: { orders: OrderType[] }) => {
  return (
    <section className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 py-10'>
      <div className='main-max-width mx-auto padding-x'>

        {/* Titre */}
        <h2 className='font-semibold text-2xl max-sm:text-[16px] text-gray-800 my-6 text-center'>Commandes passées </h2>
        
        {/* Contenu des commandes */}
        {orders.length > 0 ? (
          <OrderContainer />
        ) : (
          <p className="text-center text-gray-500">Aucune commande trouvée.</p>
        )}
        
      </div>
    </section>
  )
}

export default PurchasedOrder