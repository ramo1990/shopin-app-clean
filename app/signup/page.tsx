"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { registerUser, signInWithGoogle } from "@/lib/actions"
import Image from "next/image"
import type { AxiosError } from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

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
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")

    try {
      // Enregistrement de l'utilisateur
      const registerRes = await registerUser(form)
      console.log("Inscription réussie de signup:", registerRes.message);

    // Envoie l’email de vérification
    const emailRes = await fetch(`${API_URL}/send-verification-email/`, {
      method: "POST",
      headers: {
        // Authorization: `Bearer ${loginData.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: form.email }) // envoie l'email
    })

    if (!emailRes.ok) {
      const emailError = await emailRes.json();
      console.error("Email verification error:", emailError);
      throw new Error("Erreur d'envoi de l'email de vérification");
    }

    const emailData = await emailRes.json()
    console.log('Email verification response:', emailData);

    // Rediriger après un délai (par ex 3s)
    setTimeout(() => {
      router.push("/email-sent")
    }, 1000)

      router.push("/email-sent")
    } catch (err: unknown) {
      const error = err as AxiosError<{ [key: string]: string[] }>
      if (error.response?.data) {
        const messages = Object.values(error.response.data).flat().join(" ")
        setError(messages)
      } else {
        setError("Erreur inconnue s'est produite.")
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Créer un compte
        </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* <h2 className="text-2xl font-bold text-center text-gray-800">Créer un compte</h2> */}

        <input name="username" placeholder="Nom d'utilisateur" value={form.username} onChange={handleChange} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition" 
          required />
        
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition" 
          required />

        <input name="first_name" placeholder="Prénom" value={form.first_name} onChange={handleChange} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition" />

        <input name="last_name" placeholder="Nom" value={form.last_name} onChange={handleChange} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition" />

        <input name="phone" type="tel" placeholder="Téléphone" value={form.phone} onChange={handleChange} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition" />

        <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition" 
          required />

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 p-2 rounded">{error}</p>)}

        {successMessage && (
          <p className="text-green-600 text-sm bg-green-50 border border-green-200 p-2 rounded mb-4">
            {successMessage}
          </p>
        )}

        <button type="submit" className="w-full h-12 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition">
          S&rsquo;inscrire</button>
      </form>
      
      <div className="flex items-center justify-center w-full max-w-md my-6">
        <span className="flex-grow h-px bg-gray-300"></span>
        <span className="px-3 text-center text-gray-500 text-sm">ou</span>
        <span className="flex-grow h-px bg-gray-300"></span>
      </div>

        <button
            type='button'
            onClick={signInWithGoogle}
            className='w-full h-12 flex items-center justify-center gap-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition'
        >
            <Image
            src="/logo_google.png" // remplace par le logo Google si dispo
            alt="Google Icon"
            width={60}
            height={60}
            className='rounded-full'
            />
            <span className="text-sm font-medium text-gray-700">Continuer avec Google</span>
        </button>

        <p className="text-center text-sm mt-6 text-gray-600">
          Déjà un compte ? {" "} 
          <a href="/signin" className="text-blue-600 hover:underline">Connexion</a>
        </p>
        </div>
    </div>
  )
}

export default SignUpPage
