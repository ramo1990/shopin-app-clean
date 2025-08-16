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

  const handleDelete = async (slug: string, productId:number) => {
    const confirmed = confirm('Supprimer ce produit ?')
    if (!confirmed) return

    try {
      await axiosInstance.delete(`/custom-admin/products/${slug}/`)

      // Met à jour la liste localement
      setProducts((prev) => prev.filter((p) => p.id !== productId))
    } catch (err) {
      alert("Échec de la suppression")
      console.error(err)
    }
  }

  if (loading) return <p>Chargement...</p>
  // if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Produits</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <button
        onClick={() => router.push('/admin/products/new')}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Ajouter un produit
      </button>

      {products.length === 0 ? (
        <p>Aucun produit pour le moment.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Titre</th>
              <th className="p-2 border">Prix</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} className="text-center border-t">
                <td className="p-2">
                  {prod.image ? (
                    <img
                      src={prod.image.startsWith('http') ? prod.image : `${API_URL}${prod.image}`}
                      alt={prod.title}
                      className="w-16 h-16 object-cover mx-auto"
                    />
                  ) : (    <span className="text-gray-500 italic">Aucune image</span>)}
                </td>

                <td className="p-2">{prod.title}</td>
                <td className="p-2">{prod.price} €</td>
                <td className="p-2">{prod.stock}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => router.push(`/admin/products/edit/${prod.slug}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(prod.slug, prod.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
