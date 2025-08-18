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
        <div className="bg-white shadow rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Ajouter un tag</h1>
      
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-200 text-sm">
        {error}</div>)}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nom */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>

        {/* Image */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Image (optionnel)</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer 
                focus:outline-none file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-gray-100 
                file:text-gray-700 hover:file:bg-gray-200"/>
        </div>
        {/* Submit */}
        <button type="submit" 
          className="w-full bg-green-600 text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-green-700 transition">
          Créer
        </button>
      </form>
    </div>
  </div>
  )
}
