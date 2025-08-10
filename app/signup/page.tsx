"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { registerUser, signInWithGoogle } from "@/lib/actions"
import Image from "next/image"
import type { AxiosError } from "axios"


const SignUpPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: ""
  })
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await registerUser(form)
      router.push("/signin")
    } catch (err: unknown) {
      const error = err as AxiosError<{ [key: string]: string[] }>
      if (error.response?.data) {
        const messages = Object.values(error.response.data).flat().join(" ")
        setError(messages)
      } else {
        setError("Erreur inconnue.")
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 max-w-md w-full space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Créer un compte</h2>

        <input name="username" placeholder="Nom d'utilisateur" value={form.username} onChange={handleChange} className="w-full border px-4 py-2 rounded-md" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border px-4 py-2 rounded-md" required />
        <input name="first_name" placeholder="Prénom" value={form.first_name} onChange={handleChange} className="w-full border px-4 py-2 rounded-md" />
        <input name="last_name" placeholder="Nom" value={form.last_name} onChange={handleChange} className="w-full border px-4 py-2 rounded-md" />
        <input name="phone" type="tel" placeholder="Téléphone" value={form.phone} onChange={handleChange} className="w-full border px-4 py-2 rounded-md" />
        <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} className="w-full border px-4 py-2 rounded-md" required />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">S&rsquo;inscrire</button>
      </form>

      <div className="text-center text-sm text-gray-400">ou</div>

        <button
            type='button'
            onClick={signInWithGoogle}
            className='w-full flex items-center cursor-pointer justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-50 mt-2'
        >
            <Image
            src="/casquette.jpeg" // remplace par le logo Google si dispo
            alt="Google Icon"
            width={20}
            height={20}
            className='mr-3'
            />
            <span className="text-sm font-medium text-gray-700">Continuer avec Google</span>
        </button>

        <p className="text-center text-sm mt-4">
          Déjà un compte ? <a href="/signin" className="text-blue-600 hover:underline">Connexion</a>
        </p>
        
    </div>
  )
}

export default SignUpPage
