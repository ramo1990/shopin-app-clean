"use client" // Indique que ce composant est côté client (obligatoire pour utiliser useState, useEffect, etc.)

/* Ce code:
  Gère une connexion manuelle avec identifiants et mot de passe.
  Gère une connexion via Google OAuth.
  Gère l’état d’erreur et redirige l’utilisateur après login.
  Utilise AuthContext pour sauvegarder les infos utilisateur globalement.
  Utilise le localStorage pour persister les tokens JWT.  
*/
import React, {useState} from 'react'
import Image from "next/image"
import {loginUser, signInWithGoogle} from '@/lib/actions' // Fonctions pour se connecter avec identifiants ou Google
import {useRouter, useSearchParams} from "next/navigation"  // Hook de navigation Next.js pour rediriger l’utilisateur
import { useAuth } from '@/context/AuthContext'  // Hook personnalisé pour accéder au contexte d’authentification
import PasswordField from '@/components/password/PasswordField'
import type { AxiosError } from 'axios'


const SignInPage = () => {
  // États pour le formulaire
  const [username, setUsername] = useState("")  // Nom d’utilisateur saisi
  const [password, setPassword] = useState("")  // Mot de passe saisi
  const [error, setError] = useState("")  // Message d'erreur affiché si connexion échoue
  const [emailNotVerified, setEmailNotVerified] = useState(false)

  const router = useRouter() // Pour rediriger après la connexion
  const { login } = useAuth() // Récupère la fonction `login` depuis le contexte AuthProvider
  const searchParams = useSearchParams()
  const verified = searchParams.get("verified") === "true"
  
  // Fonction appelée à la soumission du formulaire
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()  // Empêche le rechargement de la page

    try {
      // Appelle l’API Django pour obtenir un token JWT et les infos de l’utilisateur
      const { access, refresh, user } = await loginUser(username, password)

      // Stocke les tokens JWT dans le localStorage pour les requêtes futures
      localStorage.setItem("accessToken", access)
      localStorage.setItem("refreshToken", refresh)

      // Ajout ici : stockage de l'email et du nom
    localStorage.setItem("userEmail", user.email)
    localStorage.setItem("userName", user.name)

      // Met à jour le contexte Auth avec le token et les infos utilisateur
      login(access, user) // passer le token ici, pas l'user

      setError("")  // Réinitialise les erreurs
      router.push("/") // Redirige vers la page d’accueil après connexion réussie

    } catch (err: unknown) {
      const axiosError = err as AxiosError<any>
      const code = axiosError.response?.data?.code

      if ( code === "email_not_verified"){
        setError("Votre compte n’est pas encore activé. Vérifiez votre email.")
        setEmailNotVerified(true)
      } else if (code === "invalid_credentials") {
        setError("Identifiants incorrects.")
      } else {
        setError("Une erreur est survenue.")
      }
    }
  }

  return (
    <div className='bg-gray-50 flex items-center justify-center min-h-screen px-4'>
      <div className='bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-sm w-full flex flex-col gap-6'>
        <h2 className='text-3xl font-semibold text-center text-gray-900'>Bienvenue</h2>
        <p className="text-center text-gray-600 text-sm">Connecte-toi à ton compte</p>

        {/* Message après vérification email */}
        {verified && (
          <p className="text-green-600 text-sm text-center">
            Email vérifié ! Vous pouvez maintenant vous connecter.
          </p>
        )}

        {/* --- Connexion avec identifiants Django --- */}
        <form onSubmit={handleLogin} className='flex flex-col gap-4'>
          {/* Champ pour le nom d’utilisateur */}
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            className="border border-gray-300 px-4 py-2 rounded-md text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <PasswordField password={password} setPassword={setPassword}/>

          {/* Mot de passe oublié */}
          <p className="text-right text-sm">
            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </p>

          {/* Affiche un message d’erreur s’il y en a */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Renvoie de lien de verification d'email */}
          {emailNotVerified && (
            <button
              className="mt-2 text-sm text-blue-600 underline"
              onClick={async () => {
                try{
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resend-verification-email-with-credentials/`, {
                  method: "POST",
                  headers: {
                    // Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ username, password }), // on passe les identifiants selon le backend
                })

                const data = await res.json()

                if (res.ok) {
                  alert(data.message || "Un nouvel email de vérification a été envoyé.");
                } else {
                  alert(data.detail || data.error || "Échec de l’envoi de l’email.");
                }
              } catch (err) {
                alert("Une erreur est survenue lors de l'envoi.")
              }
            }}
            >
              Renvoyer le lien de vérification
            </button>
          )}


          {/* Bouton de soumission du formulaire */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700"
          >
            Se connecter 
          </button>
        </form>

        {/* Séparateur visuel */}
        <div className="text-center text-sm text-gray-400"> ou </div>

        {/* --- Connexion via Google OAuth --- */}
        <form action={signInWithGoogle}>
          <button
            type='submit'
            className='w-full flex items-center cursor-pointer justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-50'
          >
            <Image
              src="/logo_google.png"
              alt="Google Icon"
              width={60}
              height={60}
              className='mr-3'
            />
            <span className="text-sm font-medium text-gray-700">Continuer avec Google</span>
          </button>
        </form>

        {/* Lien vers la page d’inscription */}
        <p className="text-center text-sm text-gray-500">
          Pas encore de compte ?{" "}
          <a
            href="/signup"
            className="text-blue-600 hover:underline font-medium">
            Inscris-toi
          </a>
        </p>

      </div>
    </div>
  )
}

export default SignInPage
