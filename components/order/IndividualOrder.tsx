import React from 'react'
import MiniProductCard from './MiniProductCard'
import { OrderType } from '@/lib/types'
import { ReceiptText } from 'lucide-react'

const IndividualOrder = ({order}: {order: OrderType}) => {

  const orderitems = order.items
  return (
    <div className='w-full border border-gray-200 bg-white p-4 rounded-xl shadow-md space-y-4'>

        {/* En-tête de la commande */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-4 rounded-md border border-gray-200 shadow-sm'>
            <div className='flex items-center gap-2'>
              <ReceiptText className='w-5 h-5 text-green-600'/>
              <p className='text-sm sm:text-base font-medium text-gray-800'>
                Numéro de commande : <span className='text-green-600 font-semibold'>{order.order_id}</span>
            </p>
            </div>
            
            <span className="text-xs text-gray-500 mt-2 sm:mt-0">{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
        </div>
      
      {/* Liste des produits */}
      <div className='flex gap-4 px-6 py-6 bg-white overflow-x-auto'>
        {orderitems.map((orderitem) => (<MiniProductCard key={orderitem.id} item={orderitem} />))}
      </div>

    </div>
  )
}

export default IndividualOrder
