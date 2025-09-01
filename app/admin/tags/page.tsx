'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'
import Image from 'next/image'
// import Link from 'next/link'

interface Tag {
  id: number
  name: string
  slug: string
  image: string | null
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    axiosInstance
      .get('/custom-admin/tags/')
      .then(res => setTags(res.data))
      .catch(err => {
        console.error(err)
        setError('Erreur lors du chargement des tags.')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-600 text-center py-6">Chargement…</p>
  if (error) return <p className="text-red-600 text-center py-6">{error}</p>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Tags</h1>

          <button
            onClick={() => router.push('/admin/tags/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            Ajouter un Tag
          </button>
        </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-center">Image</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tags.map(tag => (
              <tr key={tag.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{tag.name}</td>
                <td className="px-4 py-3">{tag.slug}</td>
                <td className="px-4 py-3 text-center">
                  {tag.image ? (
                    <Image
                      src={tag.image.startsWith('http') ? tag.image : `${process.env.NEXT_PUBLIC_API_URL}${tag.image}`}
                      alt={tag.name}
                      className="w-12 h-12 object-cover rounded-md mx-auto"
                    />
                  ) : (
                    <span className="text-gray-400 italic">Aucune</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => router.push(`/admin/tags/edit/${tag.slug}`)}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition">
                    Modifier
                  </button>

                  <button
                    onClick={async () => {
                      if (confirm('Supprimer ce tag ?')) {
                        await axiosInstance.delete(`/custom-admin/tags/${tag.slug}/`)
                        setTags(prev => prev.filter(t => t.id !== tag.id))
                      }
                    }}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {tags.length === 0 && (
              <tr>
                <td colSpan={4} className='py-6 text-center text-gray-500'>Aucun tag trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}
