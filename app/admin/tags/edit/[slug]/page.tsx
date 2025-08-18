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

  if (loading) return <p>Chargement…</p>

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Modifier le tag</h1>
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
          <label className="block font-medium">Image (laisser vide pour ne pas la changer)</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files?.[0] || null)}
          />
        </div>
        {currentImage && !imageFile && (
          <img
            src={currentImage.startsWith('http') ? currentImage : `${process.env.NEXT_PUBLIC_API_URL}${currentImage}`}
            alt="Aperçu du tag"
            className="mt-2 w-32 h-32 object-cover rounded"
          />
        )}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Enregistrer ↲
        </button>
      </form>
    </div>
  )
}
