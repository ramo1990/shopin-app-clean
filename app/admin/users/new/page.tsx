'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import axiosInstance from '@/lib/axiosInstance'
import axios from 'axios'

interface FormValues {
  email: string
  username: string
  first_name: string
  last_name: string
  password: string
  is_staff: boolean
  is_active: boolean
}

export default function NewUserPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    try {
      await axiosInstance.post('/custom-admin/users/', data)
      router.push('/admin/users')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data)
      } else {
        console.error(err)
      }
      alert('Erreur lors de la création de l’utilisateur.')
    }
  }

  const fields: Array<{
    name: keyof FormValues
    label: string
    type: string
    required: boolean
  }> = [
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'username', label: 'Nom d’utilisateur', type: 'text', required: true },
    { name: 'first_name', label: 'Prénom', type: 'text', required: false },
    { name: 'last_name', label: 'Nom', type: 'text', required: false },
    { name: 'password', label: 'Mot de passe', type: 'password', required: true },
  ]

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Créer un utilisateur</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {fields.map(({ name, label, type, required }) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              {...register(name, { required })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors[name as keyof FormValues] && (<p className="text-red-500 text-xs mt-1">Ce champ est requis</p>)}
          </div>
        ))}

        <div className="flex items-center gap-4">
          <label className="inline-flex items-center">
            <input type="checkbox" {...register('is_staff')} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <span className="ml-2 text-gray-700">Staff (Accès admin)</span>
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" {...register('is_active')} className="h-4 w-4 text-green-600 border-gray-300 rounded" 
              defaultChecked /> <span className="ml-2 text-gray-700">Actif</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded-lg font-medium text-white shadow 
            ${isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
          {isSubmitting ? 'Création...' : 'Créer'}
        </button>
      </form>
    </div>
  </div>
  )
}
