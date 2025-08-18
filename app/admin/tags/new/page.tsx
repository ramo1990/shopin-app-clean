'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axiosInstance from '@/lib/axiosInstance'

export default function NewTagPage() {
  const [name, setName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const formData = new FormData()
    formData.append('name', name)
    if (imageFile) formData.append('image', imageFile)

    try {
      await axiosInstance.post('/custom-admin/tags/', formData)
      router.push('/admin/tags')
    } catch (err: any) {
      console.error(err.response?.data)
      setError('Erreur lors de la création du tag.')
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ajouter un tag</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nom</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded px-3 py-1"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Image (optionnel)</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files?.[0] || null)}
          />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Créer
        </button>
      </form>
    </div>
  )
}
