'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
      const token = localStorage.getItem('access')
    //   if (!token) {
    //     router.push('/login')
    //     return
    //   }

      try {
        // const res = await fetch(`${API_URL}/products/`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // })

        const res = await fetch(`${API_URL}/products/`)

        if (!res.ok) {
            const errorText = await res.text()
            console.error('Erreur:', res.status, errorText)
            throw new Error('Erreur lors du chargement des produits.')
        }

        const data = await res.json()
        console.log('DATA:', data)
        setProducts(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [router])

  const handleDelete = async (productId: number) => {
    const confirmed = confirm('Supprimer ce produit ?')
    if (!confirmed) return

    const token = localStorage.getItem('access')

    try {
      const res = await fetch(`${API_URL}/products/${productId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Erreur lors de la suppression.")
      }

      // Met à jour la liste localement
      setProducts((prev) => prev.filter((p) => p.id !== productId))
    } catch (err) {
      alert("Échec de la suppression")
    }
  }

  if (loading) return <p>Chargement...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Produits</h1>

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
                  <img
                    src={`${API_URL}${prod.image}`}
                    alt={prod.title}
                    className="w-16 h-16 object-cover mx-auto"
                  />
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
                    onClick={() => handleDelete(prod.id)}
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
