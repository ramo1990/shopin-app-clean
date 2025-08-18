'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axiosInstance from '@/lib/axiosInstance'
import BarChart from '@/components/admin/BarChart'

const AdminHomePage = () => {
  const [stats, setStats] = useState<{
    totalSales: number
    totalOrders: number
    recentProducts: { id: number; title: string; price: number }[]
    chart: { months: string[]; sales: number[] }
  } | null>(null)

  useEffect(() => {
    axiosInstance.get('/custom-admin/stats/')
      .then(res => setStats(res.data))
      .catch(err => console.error("Échec récupération stats", err))
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Bienvenue sur le tableau de bord Admin</h1>
      <p className="text-gray-600">Utilisez le menu de gauche pour gérer les ressources.</p>

      {/* Widgets de résumé */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-md hover:shadow-lg transition">
            <p className="text-sm text-gray-500">Ventes totales</p>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalSales} €</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-md hover:shadow-lg transition">
            <p className="text-sm text-gray-500">Commandes</p>
            <p className="text-3xl font-bold text-pink-600">{stats.totalOrders}</p>
          </div>
        </div>
      )}

      {/* Liens de navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="block border rounded-xl p-6 shadow-md hover:shadow-lg transition bg-white"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Produits</h2>
          <p className="text-gray-500 text-sm">Gérez les produits de la boutique.</p>
        </Link>

        <Link
          href="/admin/users"
          className="block border rounded-xl p-6 shadow-md hover:shadow-lg transition bg-white"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Utilisateurs</h2>
          <p className="text-gray-500 text-sm">Voir et gérer les utilisateurs inscrits.</p>
        </Link>

        <Link
          href="/admin/orders"
          className="block border rounded-xl p-6 shadow-md hover:shadow-lg transition bg-white"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Commandes</h2>
          <p className="text-gray-500 text-sm">Suivre les commandes clients.</p>
        </Link>
      </div>

      {/* Graphique */}
      {stats?.chart && (
        <div className="mt-10 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Ventes sur les 6 derniers mois</h2>
          <div className="max-w-2xl">
            <BarChart
              labels={stats.chart.months}
              data={stats.chart.sales}
              title="Chiffre d'affaires"
            />
          </div>
        </div>
      )}

      {/* Produits récents */}
      {stats?.recentProducts && (
        <div className="mt-10 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Produits récents</h2>
          <ul className="divide-y divide-gray-200">
            {stats.recentProducts.map((prod) => (
              <li key={prod.id} className="py-3 flex justify-between">
                <span className="text-gray-800">{prod.title}</span>
                <span className="text-sm text-gray-500">{prod.price} €</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AdminHomePage
