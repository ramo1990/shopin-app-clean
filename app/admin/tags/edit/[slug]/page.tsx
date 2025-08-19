'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'

export default function EditTagPage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()

  const [name, setName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosInstance.get(`/custom-admin/tags/${slug}/`)
      .then(res => {
        setName(res.data.name)
        setCurrentImage(res.data.image || null)
      })
      .catch(err => {
        console.error(err)
        setError('Impossible de récupérer le tag.')
      })
      .finally(() => setLoading(false))
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const formData = new FormData()
    formData.append('name', name)
    if (imageFile) formData.append('image', imageFile)

    try {
      await axiosInstance.put(`/custom-admin/tags/${slug}/`, formData)
      router.push('/admin/tags')
    } catch (err: any) {
      console.error(err.response?.data)
      setError('Erreur lors de la mise à jour.')
    }
  }

  if (loading) return <p className="text-gray-500">Chargement…</p>

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Modifier le tag</h1>

      {error && (<div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-200 text-sm">{error}</div>)}

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

        {/* Upload */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Image (laisser vide pour ne pas la changer)</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer 
                focus:outline-none file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-gray-100 
                  file:text-gray-700 hover:file:bg-gray-200"/>
        </div>

        {/* Aperçu image */}
        {currentImage && !imageFile && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-1">Image actuelle :</p>
            <img
              src={currentImage.startsWith('http') ? currentImage : `${process.env.NEXT_PUBLIC_API_URL}${currentImage}`}
              alt="Aperçu du tag"
              className="w-32 h-32 object-cover rounded-lg border shadow-sm"/>
          </div>
        )}

        {/* Bouton */}
        <button type="submit" 
          className="w-full bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
          Enregistrer
        </button>
      </form>
    </div>
  </div>
  )
}
