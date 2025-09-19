'use client'

import { useState } from 'react'
import axiosInstance from '@/lib/axiosInstance'
import { refreshTokenIfNeeded } from '@/lib/auth'

interface PaiementProPaymentProps {
  orderId: number
  deliveryCost: number
  total: number
  channel: string
}

class PaiementPro {
    merchantId: string;
    amount: number = 0;
    description: string = '';
    channel: string = ''; // OMCIV2 / MTNCIV2 / WAVECI
    countryCurrencyCode: string = '952'; // 952 = Franc CFA
    referenceNumber: string = '';
    customerEmail: string = '';
    customerFirstName: string = '';
    customerLastname: string = '';
    customerPhoneNumber: string = '';
    notificationURL: string = '';
    returnURL: string = '';
    returnContext: string = '';
    url: string = '';
    success: boolean = false;
    error: string = '';
  
    constructor(merchantId: string) {
      this.merchantId = merchantId;
    }
  
    async init() {
      const response = await fetch("https://paiementpro.net/webservice/onlinepayment/js/initialize/initialize.php", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this)
      });
      const data = await response.json();
      this.url = data.url;
      this.success = data.success;
      this.error = data.error;
    }
  
    async getUrlPayment() {
      await this.init();
    }
  }

export default function PaiementProPayment({ orderId, deliveryCost, total, channel }: PaiementProPaymentProps) {
  console.log("PaiementProPayment rendu avec :", { orderId, deliveryCost, total })
  const [isLoading, setIsLoading] = useState(false)
//   const [scriptLoaded, setScriptLoaded] = useState(false)

  const handlePaiementProCheckout = async () => {
    console.log("Début PaiementPro");
    setIsLoading(true)
    const token = await refreshTokenIfNeeded()
    if (!token) {
      alert('Veuillez vous connecter pour payer.')
      setIsLoading(false)
      return
    }

    try {
      const res = await axiosInstance.get(`/orders/${orderId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("Commande reçue :", res.data)

      const order = res.data

      const paiementPro = new PaiementPro(process.env.NEXT_PUBLIC_PAIEMENTPRO_MERCHANT_ID!) // ⚠️ .env

      paiementPro.amount = Math.round(total + deliveryCost)
      paiementPro.channel = channel // 💡 Orange CI — tu peux aussi le rendre dynamique
      paiementPro.referenceNumber = `CMD-${order.id}-${Date.now()}`
      paiementPro.customerEmail = order.customer_email || 'client@example.com'
      paiementPro.customerFirstName = order.customer_first_name || 'Client'
      paiementPro.customerLastname = order.customer_last_name || 'Paiement'
      paiementPro.customerPhoneNumber =order.customer_phone || order.shipping_address.phone
      paiementPro.description = `Commande #${order.id}`
    //   paiementPro.returnURL = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/confirmation/${order.id}`
      paiementPro.returnURL = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/confirmation/${order.order_id}`
      paiementPro.notificationURL = `${process.env.NEXT_PUBLIC_API_URL}/paiementpro/webhook/`
      paiementPro.returnContext = JSON.stringify({ order_id: order.id })

      console.log("MERCHANT ID:", process.env.NEXT_PUBLIC_PAIEMENTPRO_MERCHANT_ID)
      console.log("PaiementPro.success:", paiementPro.success)
      console.log("PaiementPro.url:", paiementPro.url)
      console.log("PaiementPro.error:", paiementPro.error)
      await paiementPro.getUrlPayment()
      console.log("Réponse PaiementPro :", paiementPro)
      console.log("paiementPro.success:", paiementPro.success)
      console.log("paiementPro.url:", paiementPro.url)
      console.log("paiementPro.error:", paiementPro.error)

      if (paiementPro.success) {
        console.log("Redirection vers :", paiementPro.url)
        window.location.href = paiementPro.url
      } else {
        alert('Erreur : impossible d’obtenir le lien de paiement.')
        console.error(paiementPro.error)
      }
    } catch (err) {
      console.error('PaiementPro error:', err)
      alert('Erreur lors de l’initiation du paiement.')
    } finally {
      setIsLoading(false)
    }
  }

  const totalWithDelivery = total + deliveryCost
  const isBelowMinimum = totalWithDelivery < 1

  console.log({
    isLoading,
    isBelowMinimum,
    totalWithDelivery
  })
  
  return (
    <>
      <button
        onClick={() => {
            console.log("clic PaiementPro")
            handlePaiementProCheckout()}}
        disabled={isLoading || isBelowMinimum}
        className="bg-blue-600 mx-auto text-white px-6 py-3 rounded w-full block text-center font-semibold shadow-lg hover:bg-blue-700 transition"
        style={{ zIndex:9999, position: 'relative' }}
      >
        {isLoading ? 'Redirection...' : 'Payer'}
      </button>

      {isBelowMinimum && (
        <p className="text-red-500 text-sm mt-2">
          Le montant minimum pour un paiement est de 1 FCFA.
        </p>
      )}
    </>
  )
}
