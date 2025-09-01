'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'


interface Tag {
  id: number
  name: string
  slug: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axiosInstance.get('/tags/')
        setAllTags(res.data)
      } catch (err) {
        console.error('Erreur lors du chargement des tags:', err)
      }
    }
    fetchTags()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('stock', stock)
    if (image) formData.append('image', image)
    tags.forEach(tagId => formData.append('tag_ids', tagId))

    try {
      await axiosInstance.post('/custom-admin/products/', formData)
      setSuccess('Produit créé avec succès')
      router.push('/admin/products')
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message)
      } else {
        console.error("An unknown error occurred")
      }
      setError('Erreur lors de la création du produit.')
    }
  }

  const handleTagChange = (id: number, checked: boolean) => {
    const tagIdStr = id.toString()
    setTags(prev =>
      checked ? [...prev, tagIdStr] : prev.filter(tagId => tagId !== tagIdStr)
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Créer un nouveau produit</h1>

      {error && <p className="mb-4 text-red-600 bg-red-100 px-4 py-2 rounded">{error}</p>}
      {success && <p className="mb-4 text-green-600 bg-green-100 px-4 py-2 rounded">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
            <input
              type="number"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image du produit</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                      file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                      file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Étiquettes</label>
          <div className="flex flex-wrap gap-3">
            {allTags.map(tag => (
              <label
                key={tag.id}
                className="flex items-center gap-2 text-sm cursor-pointer px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  value={tag.id}
                  checked={tags.includes(tag.id.toString())}
                  onChange={(e) => handleTagChange(tag.id, e.target.checked)}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Créer le produit
        </button>
      </form>
    </div>
  )
}
