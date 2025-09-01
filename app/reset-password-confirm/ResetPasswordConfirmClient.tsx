"use client"

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ResetPasswordConfirmPage() {
  const searchParams = useSearchParams()
  const uid = searchParams.get("uid")
  const token = searchParams.get("token")

  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password1 !== password2) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    
    try {

      const getCookie = (name: string): string | undefined => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
      }

      const csrfToken = getCookie('csrftoken');
      
      // Construire l'objet headers dynamiquement
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/password/reset/confirm/`, {
        method: "POST",
        headers,
        body: JSON.stringify({ uid, token, new_password1: password1, new_password2: password2 }),
        credentials: 'include', // Important pour envoyer les cookies
      })

    const data = await res.json()
    if (res.ok) {
      setSuccess(true);
      setUsername(data?.username || "")
      alert(`Mot de passe modifié avec succès${data?.username ? `, ${data.username}` : ""} !`)
    } else {
      const allErrors = Object.values(data).flat().join(" ")
      setError(allErrors || "Erreur lors du changement de mot de passe.")
    }
  } catch {
    setError("Erreur de connexion au serveur.")
  }
}

  return (
<div className='bg-gray-50 flex items-center justify-center min-h-screen px-4'>
      <div className='bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-sm w-full flex flex-col gap-6'>
        <h2 className='text-3xl font-semibold text-center text-gray-900'>
          Réinitialisation du mot de passe
        </h2>
        <p className="text-center text-gray-600 text-sm">
          Choisis un nouveau mot de passe sécurisé.
        </p>

        {success ? (
          <div className="text-green-600 text-sm text-center bg-green-50 border border-green-200 p-3 rounded-md">
            Mot de passe modifié avec succès
            {username && <> pour <strong>{username}</strong></>}. <br />
            <a href="/signin" className="underline text-blue-600 hover:text-blue-800">
              Connecte-toi ici
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              className="border border-gray-300 px-4 py-2 rounded-md text-sm"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirme le mot de passe"
              className="border border-gray-300 px-4 py-2 rounded-md text-sm"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />

            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Valider
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500">
          Tu n’as pas de compte ?{" "}
          <a href="/signup" className="text-blue-600 hover:underline font-medium">
            Inscris-toi
          </a>
        </p>
      </div>
    </div>
  )
}
