'use client'
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function PaiementRetourPage() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const status = params.get('status')
    const orderId = params.get('order_id')

    if (status === 'cancelled') {
      localStorage.setItem('paiement_annule', '1')
    }

    router.replace('/checkout')
  }, [params, router])

  return <p>Redirection...</p>
//   return null
}