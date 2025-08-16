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
  tags: Tag[]     // maintenant tableau d’objets tags avec id, name, etc.
  image: string
}

export default function EditProductPage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()

  const [product, setProduct] = useState<ProductData | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [tagIds, setTagIds] = useState<number[]>([]) // IDs des tags sélectionnés
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [allTags, setAllTags] = useState<Tag[]>([])

  // Fetch produit
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
        // on récupère les IDs des tags
        setTagIds(data.tags.map((tag: Tag) => tag.id))
      } catch (err: any) {
        setError("Impossible de récupérer le produit.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  // Fetch tous les tags pour le select
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axiosInstance.get('/custom-admin/tags/')
        setAllTags(res.data)
      } catch (e) {
        console.error('Impossible de récupérer les tags')
      }
    }
    fetchTags()
  }, [])

  // Gestion changement tags dans le select multiple
  const handleTagsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions)
    const ids = selectedOptions.map(option => Number(option.value))
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

    // Envoie des tag_ids (IDs) correctement
    tagIds.forEach(id => formData.append('tag_ids', id.toString()))

    if (imageFile) formData.append('image', imageFile)

    try {
      await axiosInstance.put(`/custom-admin/products/${slug}/`, formData)
      router.push('/admin/products')
    } catch (err: any) {
      setError("Erreur lors de la mise à jour.")
      console.error(err.response?.data)
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

        {/* Tags - select multiple */}
        <div>
          <label className="block font-medium">Tags</label>
          <select
            multiple
            value={tagIds.map(String)} // valeur doit être string[] dans select multiple
            onChange={handleTagsChange}
            className="w-full border rounded px-2 py-1 h-32"
          >
            {allTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
          <small className="text-gray-500">Maintenez Ctrl (Cmd) pour sélectionner plusieurs tags</small>
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
              src={product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`}
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
