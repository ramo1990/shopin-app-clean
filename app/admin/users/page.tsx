// app/admin/users/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'

interface UserData {
  id: number
  email: string
  username: string
  is_active: boolean
  is_staff: boolean
  first_name: string
  last_name: string
}

export default function AdminUserListPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/custom-admin/users/')
        setUsers(res.data)
      } catch (err: any) {
        setError('Erreur lors du chargement des utilisateurs.')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (loading) return <p className="text-gray-600">Chargement...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Utilisateurs</h1>
      <button
        onClick={() => router.push('/admin/users/new')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow"
      >
        Ajouter un utilisateur
      </button>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-xl shadow border">
      <table className="w-full text-left text-sm text-gray-700">
        <thead className='bg-gray-100 text-gray-900 text-sm font-semibold'>
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Nom d’utilisateur</th>
            <th className="px-4 py-3">Actif</th>
            <th className="px-4 py-3">Staff</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={u.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition`}>
              <td className="px-4 py-3">{u.id}</td>
              <td className="px-4 py-3">{u.email}</td>
              <td className="px-4 py-3">{u.username}</td>
              <td className="px-4 py-3">{u.is_active ? (<span className="text-green-600 font-medium">Oui</span>
                ) : (<span className="text-red-500 font-medium">Non</span>)}</td>

              <td className="px-4 py-3">{u.is_staff ? (<span className="text-blue-600 font-medium">Oui</span>
              ) : (<span className="text-gray-500">Non</span>)}</td>
              
              <td className="px-4 py-3 flex justify-end gap-2">
                <button onClick={() => router.push(`/admin/users/edit/${u.id}`)} 
                className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-sm shadow">Modifier</button>
                
                <button onClick={async () => {
                  if (confirm('Supprimer cet utilisateur ?')) {
                    await axiosInstance.delete(`/custom-admin/users/${u.id}/`)
                    setUsers(users.filter(x => x.id !== u.id))
                  }
                }} className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm shadow">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}
