'use client'

import React, { useState } from 'react'
import { useCartContext } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'
import { refreshTokenIfNeeded } from '@/lib/auth'
// import { useAuth } from '@/context/AuthContext'


const CartSummary = () => {
  const { cart } = useCartContext()
  // const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const subtotal = cart.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0)

  // Calcul frais de livraison selon le montant
  const deliveryStandardCost = 0 // Gratuit
  const deliveryExpressCost = subtotal < 20000 ? 2000 : 0
  const estimatedTax = subtotal * 0.05
  const total = subtotal + estimatedTax

  const handleCheckout = async () => {
    const token = await refreshTokenIfNeeded()
    const paymentMethod = 'card'

    if (!token) {
      router.push('/signin?next=/checkout')
      return
    }

    try {
      const res = await axiosInstance.get('/shipping-address/', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.data.length === 0) {
        // Pas encore d'adresse => redirige vers checkout pour en ajouter une
        router.push('/checkout')
        return
      } 
      
      const addressId = res.data[0].id

      const order = await axiosInstance.post(
          '/orders/',
          {
            shipping_address_id: addressId,
            payment_method: paymentMethod,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        console.log("Réponse de création de commande :", order)
        
        const orderId = order?.data?.order_id
        if (orderId !=null){
          localStorage.setItem('currentOrderId', orderId.toString()) // ✅ Stocke l’ID
        // ✅ Rediriger vers checkout sans clearCart (le faire après paiement)
        router.push('/checkout')
        } else {
          console.error('ID de commande manquant dans la réponse:', order)
          setError("Impossible de récupérer l'ID de la commande.")
        }
      } catch (err) {
      console.error('Erreur lors du passage de commande:', err)
      setError('Erreur lors du passage de la commande.')
    }
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Résumé de la commande</h2>

      <div className="flex justify-between text-gray-700">
        <p>Sous-total</p>
        <p>{subtotal.toFixed(2)} $</p>
      </div>

      <div className="flex justify-between text-gray-700">
        <p>Tax estimée</p>
        <p>{estimatedTax.toFixed(2)} $</p>
      </div>

      <div className="flex justify-between font-semibold text-lg text-gray-900">
        <p>Total</p>
        <p>{total.toFixed(2)} $</p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleCheckout}
        className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={total < 0}
      >
        Passer la commande
      </button>
    </div>
  )
}

export default CartSummary