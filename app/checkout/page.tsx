'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { refreshTokenIfNeeded } from '@/lib/auth'
import axiosInstance from '@/lib/axiosInstance'
import type { AxiosError } from 'axios'

export default function ShippingForm() {
  const router = useRouter()

  const [form, setForm] = useState({
    full_name: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    phone: '',
    payment_method: 'card',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = await refreshTokenIfNeeded()
    if (!token) return alert('Connectez-vous pour continuer.')

    try {
      const token = await refreshTokenIfNeeded()
      if (!token) return alert('Connectez-vous pour continuer.')

      console.log('Formulaire envoyé dans shipping form:', form)

      // Crée l’adresse
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { payment_method, ...addressOnly } = form

      const addressRes = await axiosInstance.post('/shipping-address/', addressOnly, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log('Réponse complète:', addressRes.data)
      const addressId = addressRes.data.id
      console.log('Adresse créée avec ID :', addressId)

      // Crée la commande
      const orderRes = await axiosInstance.post(
        '/orders/',
        {
          shipping_address_id: addressId,
          payment_method: form.payment_method,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      router.push(`/payment/${orderRes.data.order_id}`)
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('Erreur adresse/commande:', error.response?.data || error.message)
    }
        
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-4">Adresse de livraison</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tous les champs sauf payment_method */}
        {Object.entries(form)
          .filter(([key]) => key !== 'payment_method')
          .map(([key, value]) => (
            <input
              key={key}
              name={key}
              placeholder={key.replace('_', ' ')}
              value={value}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          ))}

        {/* Méthode de paiement */}
        <select
          name="payment_method"
          value={form.payment_method}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="card">Carte bancaire</option>
          <option value="paypal">PayPal</option>
          <option value="cod">Paiement à la livraison</option>
        </select>

        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Continuer vers le paiement
        </button>
      </form>
    </div>
  )
}
