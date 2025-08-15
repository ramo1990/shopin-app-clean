'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface ProductData {
  slug: string
  title: string
  description: string
  price: string
  stock: number
  tags: string[]     // noms de tags
  image: string      // URL relative
}

export default function EditProductPage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()

  const [product, setProduct] = useState<ProductData | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [tags, setTags] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
    //   const token = localStorage.getItem('access')
    //   if (!token) return router.push('/login')

      try {
        // const res = await fetch(`${API_URL}/products/${id}/`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // })
        const res = await fetch(`${API_URL}/products/${slug}`)
        if (!res.ok) throw new Error('Impossible de récupérer le produit')
        const data = await res.json()
        setProduct(data)
        setTitle(data.title)
        setDescription(data.description)
        setPrice(data.price)
        setStock(data.stock.toString())
        setTags(data.tags.join(', '))
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const token = localStorage.getItem('access')
    if (!token) return router.push('/login')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('stock', stock)
    formData.append('tag_ids', JSON.stringify(tags.split(',').map((t) => t.trim()))) 
    if (imageFile) formData.append('image', imageFile)

    try {
      const res = await fetch(`${API_URL}/products/${slug}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) throw new Error('Erreur lors de la mise à jour')
      router.push('/admin/products')
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <p>Chargement…</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (!product) return <p>Produit introuvable</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Éditer : {product.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titre */}
        <div>
          <label className="block font-medium">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        {/* Prix & Stock */}
        <div className="flex space-x-4">
          <div>
            <label className="block font-medium">Prix (€)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="border rounded px-2 py-1"
              required
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium">Tags (séparés par virgule)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="ex: chaussures, été"
          />
        </div>

        {/* Image & Preview */}
        <div>
          <label className="block font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && setImageFile(e.target.files[0])}
          />
          {product.image && !imageFile && (
            <img
              src={`${API_URL}${product.image}`}
              alt={product.title}
              className="mt-2 w-32 h-32 object-cover"
            />
          )}
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover"
            />
          )}
        </div>

        {/* Soumettre */}
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Enregistrer
        </button>
      </form>
    </div>
  )
}
