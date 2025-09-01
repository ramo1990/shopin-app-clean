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
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Réinitialiser le mot de passe</h2>

        {success ? (
          <p className="text-green-600 text-center">
            Mot de passe modifié avec succès, 
            {username && 
            <>
             pour <strong>{username}.</strong>
            </>}. <br/>
            <a href="/signin" className="underline text-blue-600">Connecte-toi ici</a>
          </p>
        ) : (
          <>
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              className="border px-4 py-2 w-full"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              className="border px-4 py-2 w-full"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
          
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700 transition">
              Valider</button>
          </>
        )}
      </form>
    </div>
  )
}
