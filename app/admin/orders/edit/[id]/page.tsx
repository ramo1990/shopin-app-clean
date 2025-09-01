'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'

interface FormValues {
  user_id: number
  total_price: string
  is_paid: boolean
}

export default function EditOrderPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [form, setForm] = useState<FormValues>({ user_id: 0, total_price: '', is_paid: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axiosInstance.get(`/custom-admin/orders/${id}/`)
      .then(res => {
        setForm({
          user_id: res.data.user.id,
          total_price: res.data.total_price,
          is_paid: res.data.is_paid
        })
      })
      .catch(err => {
        console.error(err)
        setError('Impossible de récupérer la commande.')
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axiosInstance.put(`/custom-admin/orders/${id}/`, form)
      router.push('/admin/orders')
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message)
      } else {
        console.error('An unknown error occurred')
      }
      setError('Erreur lors de la mise à jour.')
    }
  }

  if (loading) return <p className="text-gray-600">Chargement...</p>

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Modifier la commande <span className="text-indigo-600">#{id}</span> </h1>

      {error && (<p className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 rounded-md px-3 py-2">{error}</p>)}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white shadow-md rounded-xl p-6 border">
        {/* ID Utilisateur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID Utilisateur</label>
          <input
            type="number"
            name="user_id"
            value={form.user_id}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
          />
        </div>

        {/* Montant total */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total (€)</label>
          <input
            type="number"
            step="0.01"
            name="total_price"
            value={form.total_price}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
          />
        </div>

        {/* Checkbox Payée */}
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="is_paid"
              checked={form.is_paid}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            Commande payée
          </label>
        </div>

        {/* Bouton */}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition">
        Enregistrer les modifications
        </button>
      </form>
    </div>
  )
}
