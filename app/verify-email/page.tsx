'use client'

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [message, setMessage] = useState("Vérification en cours...")

  useEffect(() => {
    if (!token) return

    fetch("http://localhost:8000/api/verify-email/", { // <-- adapte l'URL selon ton backend
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.detail === "Email verified successfully") {
          setMessage("✅ Votre email a été vérifié avec succès !")
        } else {
          setMessage("❌ Erreur: " + data.detail)
        }
      })
      .catch(() => setMessage("❌ Une erreur est survenue"))
  }, [token])

  return <div className="text-center mt-10 text-xl">{message}</div>
}
