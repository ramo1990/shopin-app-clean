'use client'

import { loadStripe } from '@stripe/stripe-js'
import React from 'react'
import axiosInstance from '@/lib/axiosInstance'
import { refreshTokenIfNeeded } from '@/lib/auth'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentProps {
  orderId: number
  deliveryCost: number
  total: number 
}

export default function StripePayment({ orderId, deliveryCost, total }: StripePaymentProps) {
    const handleCheckout = async () => {
      const stripe = await stripePromise
      const token = await refreshTokenIfNeeded()

      if (!token) {
        alert("Veuillez vous connecter pour payer.");
        return
      }

      const res = await axiosInstance.post(
        `/checkout-session/${orderId}/`, 
        {delivery_cost: deliveryCost}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const { sessionId } = res.data
      stripe?.redirectToCheckout({ sessionId })
    }
    
    const totalWithDelivery = total + deliveryCost
    const isBelowMinimum = totalWithDelivery < 500

    return (
      <>
        <button
          onClick={handleCheckout}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={isBelowMinimum}>
          Payer par carte
        </button>

        {isBelowMinimum && (
          <p className='text-red-500 text-sm mt-2'>
            Le montant minimum pour un paiement par carte est de 500 FCFA.
          </p>
        )}
      </>
    )
  }
