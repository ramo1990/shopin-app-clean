'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'

interface Order {
  id: number
  user: { id: number; email: string }
  total_price: string
  is_paid: boolean
  paid_at?: string
  created_at: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    axiosInstance.get('/custom-admin/orders/')
      .then(res => setOrders(res.data))
      .catch(err => {
        console.error(err)
        setError('Erreur lors du chargement des commandes.')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette commande ?')) return
    setDeletingId(id)
    try {
      await axiosInstance.delete(`/custom-admin/orders/${id}/`)
      setOrders(prev => prev.filter(o => o.id !== id))
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la suppression de la commande.")
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <p>Chargement...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Commandes</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">Aucune commande trouvée.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Client</th>
                <th className="px-6 py-3 text-left">Montant</th>
                <th className="px-6 py-3 text-left">Payé</th>
                <th className="px-6 py-3 text-left">Créée le</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr
                  key={o.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-3">{o.id}</td>
                  <td className="px-6 py-3">{o.user?.email || '—'}</td>
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(Number(o.total_price))}
                  </td>
                  <td className="px-6 py-3">
                    {o.is_paid ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        {o.paid_at ? new Date(o.paid_at).toLocaleDateString() : 'Oui'}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                        Non
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-center space-x-2">
                    <button
                      onClick={() => router.push(`/admin/orders/edit/${o.id}`)}
                      className="px-3 py-1 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(o.id)}
                      disabled={deletingId === o.id}
                      className={`px-3 py-1 rounded-lg text-white transition ${
                        deletingId === o.id
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {deletingId === o.id ? 'Suppression...' : 'Supprimer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}