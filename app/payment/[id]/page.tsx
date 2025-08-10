'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axiosInstance'
import { refreshTokenIfNeeded } from '@/lib/auth'
import StripePayment from '@/components/payment/StripePayment'
import { OrderType } from '@/lib/types'


export default function PaymentPage() {
    const { id } = useParams()
    const [order, setOrder] = useState<OrderType | null>(null)
  
    useEffect(() => {
      const fetchOrder = async () => {
        const token = await refreshTokenIfNeeded()
        if (!token) return
        try {
          const res = await axiosInstance.get(`/orders/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        setOrder(res.data)
      } catch (err) {
        console.error('Erreur lors de la recuperation de la commande:', err)
      }
      }

      if (id) fetchOrder()
    }, [id])
  
    if (!order) return <p>Chargement...</p>
  
    return (
      <div className="max-w-xl mx-auto mt-10">
        <h1 className="text-2xl font-semibold">Paiement commande #{order.id}</h1>
        <p>Total : {order.total} €</p>
  
        <StripePayment amount={parseFloat(order.total)} orderId={order.id} />
      </div>
    )
  }