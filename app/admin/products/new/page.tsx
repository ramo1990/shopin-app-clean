'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export default function NewProductPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<any[]>([])

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Charger les tags depuis le backend
    const fetchTags = async () => {
      try {
        const res = await fetch(`${API_URL}/tags/`)
        const data = await res.json()
        setAllTags(data)
      } catch (err) {
        console.error('Erreur lors du chargement des tags')
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
    tags.forEach(tag => formData.append('tags', tag))

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/products/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Erreur lors de la création du produit.')
      }

      setSuccess('Produit créé avec succès')
      router.push('/admin/products') // Redirection vers la liste
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Créer un nouveau produit</h1>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Titre"
          className="w-full border px-4 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full border px-4 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Prix"
          className="w-full border px-4 py-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Stock"
          className="w-full border px-4 py-2"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="block"
        />

        <div>
          <label className="font-semibold block mb-2">Étiquettes</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <label key={tag.id} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value={tag.id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTags([...tags, tag.id.toString()])
                    } else {
                      setTags(tags.filter(id => id !== tag.id.toString()))
                    }
                  }}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Créer le produit
        </button>
      </form>
    </div>
  )
}
