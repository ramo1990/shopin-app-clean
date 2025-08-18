'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface Product {
  id: number
  title: string
  price: string
  stock: number
  slug: string
  image: string
}

export default function AdminProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/custom-admin/products/')
        setProducts(res.data)
      } catch (err: any) {
        setError('Erreur lors du chargement des produits.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleDelete = async (slug: string, productId: number) => {
    const confirmed = confirm('Supprimer ce produit ?')
    if (!confirmed) return

    try {
      await axiosInstance.delete(`/custom-admin/products/${slug}/`)
      setProducts((prev) => prev.filter((p) => p.id !== productId))
    } catch (err) {
      alert("Échec de la suppression")
      console.error(err)
    }
  }

  if (loading) return <p>Chargement...</p>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Produits</h1>
        <button
          onClick={() => router.push('/admin/products/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Ajouter un produit
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-gray-600 italic">Aucun produit pour le moment.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wide">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Titre</th>
                <th className="p-3 text-center">Prix</th>
                <th className="p-3 text-center">Stock</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((prod) => (
                <tr
                  key={prod.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="p-3">
                    {prod.image ? (
                      <img
                        src={prod.image.startsWith('http') ? prod.image : `${API_URL}${prod.image}`}
                        alt={prod.title}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    ) : (
                      <span className="text-gray-400 italic">Aucune image</span>
                    )}
                  </td>
                  <td className="p-3 font-medium text-gray-800">{prod.title}</td>
                  <td className="p-3 text-center text-gray-700">{prod.price} €</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        prod.stock > 10
                          ? 'bg-green-100 text-green-700'
                          : prod.stock > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {prod.stock}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => router.push(`/admin/products/edit/${prod.slug}`)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(prod.slug, prod.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                    >
                      Supprimer
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
