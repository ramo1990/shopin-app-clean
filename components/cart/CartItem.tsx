"use client"

import React from 'react'
import Image from "next/image"
import { Minus, Plus, X } from 'lucide-react'
import { useCartContext } from '@/context/CartContext'
import type { CartItem as CartItemType} from '@/lib/types'

interface Props {
  item: CartItemType
}

const CartItem = ({ item }: Props) => {
  const { removeFromCart, updateQuantity } = useCartContext()

  const totalItemPrice = parseFloat(item.price) * item.quantity

  return (
    <div className='flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 py-6'>

      {/* Image produit */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-50">
        <Image src={item.image} alt={item.title} className='object-cover' fill sizes="80px" />
      </div>

      {/* Détails du produit */}
      <div className="flex-1 min-w-[120px] space-y-1">
        <h2 className="font-medium text-gray-800">{item.title}</h2>
        <p className="text-gray-500 text-sm">Prix: {item.price} $</p>
      </div>

      {/* Sélecteur de quantité */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (item.quantity > 1) {
              updateQuantity(item.id!, item.quantity - 1)
            } else {
              removeFromCart(item.id!)
            }
          }}
          className="p-1 bg-gray-100 rounded hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition"
        >
          <Minus size={16} />
        </button>

        <span className="text-sm font-medium text-gray-700">{item.quantity}</span>

        <button
          onClick={() => updateQuantity(item.id!, item.quantity + 1)}
          className="p-1 bg-gray-100 rounded hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Prix total de cet article */}
      <p className="w-20 text-right font-semibold text-gray-800">
        {totalItemPrice.toFixed(2)} $
      </p>

      {/* Bouton supprimer */}
      <button
        onClick={() => removeFromCart(item.id!)}
        className="text-red-500 hover:text-red-600 focus:ring-2 focus:ring-offset-2 focus:ring-red-300 rounded transition"
        aria-label="Supprimer l'article"
      >
        <X />
      </button>
    </div>
  )
}

export default CartItem
