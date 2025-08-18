'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface Tag {
  id: number
  name: string
  slug: string
  image: string
}

interface ProductData {
  slug: string
  title: string
  description: string
  price: string
  stock: number
  tags: Tag[]
  image: string
  created_by?: string
  updated_by?: string
  created_at?: string
  updated_at?: string
}

export default function EditProductPage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()

  const [product, setProduct] = useState<ProductData | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [tagIds, setTagIds] = useState<number[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [allTags, setAllTags] = useState<Tag[]>([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/custom-admin/products/${slug}/`)
        const data = res.data
        setProduct(data)
        setTitle(data.title)
        setDescription(data.description)
        setPrice(data.price)
        setStock(data.stock.toString())
        setTagIds(data.tags.map((tag: Tag) => tag.id))
      } catch {
        setError("Impossible de récupérer le produit.")
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axiosInstance.get('/custom-admin/tags/')
        setAllTags(res.data)
      } catch {}
    }
    fetchTags()
  }, [])

  const handleTagsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ids = Array.from(e.target.selectedOptions).map(o => Number(o.value))
    setTagIds(ids)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('stock', stock)
    tagIds.forEach(id => formData.append('tag_ids', id.toString()))
    if (imageFile) formData.append('image', imageFile)

    try {
      await axiosInstance.put(`/custom-admin/products/${slug}/`, formData)
      alert("Produit mis à jour avec succès.")
      router.push('/admin/products')
    } catch {
      setError("Erreur lors de la mise à jour.")
    }
  }

  if (loading) return <p className="text-center py-10 text-gray-500">Chargement…</p>
  if (error) return <p className="text-center text-red-600">{error}</p>
  if (!product) return <p className="text-center text-gray-600">Produit introuvable</p>

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Éditer : {product.title}</h1>

      {/* Infos audit */}
      {product.updated_by && (
        <p className="text-sm text-gray-600 mb-2">
          Modifié par <strong>{product.updated_by}</strong> — {new Date(product.updated_at!).toLocaleString()}
        </p>
      )}
      {product.created_by && (
        <p className="text-sm text-gray-500 mb-6">
          Créé par <strong>{product.created_by}</strong> — {new Date(product.created_at!).toLocaleString()}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Titre */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-28 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Prix & Stock */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1 text-gray-700">Prix (€)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-gray-700">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Tags</label>
          <select
            multiple
            value={tagIds.map(String)}
            onChange={handleTagsChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {allTags.map((tag) => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Maintenez Ctrl (Cmd) pour sélectionner plusieurs tags</p>
        </div>

        {/* Image */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && setImageFile(e.target.files[0])}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
            file:rounded-lg file:border-0 file:text-sm file:font-medium
            file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {product.image && !imageFile && (
            <img
              src={product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`}
              alt={product.title}
              className="mt-3 w-32 h-32 object-cover rounded-lg border"
            />
          )}
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded-lg border"
            />
          )}
        </div>

        {/* Bouton */}
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Enregistrer
        </button>
      </form>
    </div>
  )
}
