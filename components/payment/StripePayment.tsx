'use client'

import { loadStripe } from '@stripe/stripe-js'
import React from 'react'
import axiosInstance from '@/lib/axiosInstance'
import { refreshTokenIfNeeded } from '@/lib/auth'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function StripePayment({ orderId, amount }: { orderId: number; amount:number }) {
    const handleCheckout = async () => {
      const stripe = await stripePromise
      const token = await refreshTokenIfNeeded()

      if (!token) {
        alert("Veuillez vous connecter pour payer.");
        return
      }

      const res = await axiosInstance.post(`/checkout-session/${orderId}/`, {},{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const { sessionId } = res.data
      stripe?.redirectToCheckout({ sessionId })
    }
  
    return (
      <>
        <p className="mb-2">Total à payer : {amount.toFixed(2)} €</p>
        <button
          onClick={handleCheckout}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Payer par carte
        </button>
      </>
    )
  }
