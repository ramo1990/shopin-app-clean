'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCartContext } from '@/context/CartContext'
import axiosInstance from '@/lib/axiosInstance'
import { refreshTokenIfNeeded } from '@/lib/auth'

const CheckoutWithShippingPage = () => {
  const { shippingId } = useParams() as { shippingId: string }
  const { clearCart } = useCartContext()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const createOrder = async () => {
      try {
        const token = await refreshTokenIfNeeded()
        if (!token) {
          setError('Veuillez vous connecter.')
          return
        }

        const response = await axiosInstance.post(
          '/orders/',
          { shipping_address_id: Number(shippingId) },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        const { order_id } = response.data

        clearCart()
        router.push(`/confirmation/${order_id}`) // vers page de confirmation
      } catch (err) {
        setError("Erreur lors de la création de la commande.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    createOrder()
  }, [shippingId, clearCart, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      {loading ? (
        <p className="text-lg text-gray-600">Création de votre commande...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : null}
    </div>
  )
}

export default CheckoutWithShippingPage
