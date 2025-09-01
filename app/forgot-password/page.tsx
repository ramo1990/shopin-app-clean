"use client"  // Directive Next.js pour activer les hooks dans ce composant (car c’est un Client Component)

/* Ce que fait ce composant :
    Permet à l’utilisateur d’entrer son adresse email.
    Envoie l’email à l’API de Django (/api/password/reset/ via dj-rest-auth).
    Affiche un message générique pour éviter de révéler si l’email est enregistré (bon pour la sécurité).
*/
import React, { useState } from 'react'
import axios from 'axios'


const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Fonction appelée lors de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Empêche le rechargement de la page

    try {
      // Envoie une requête POST à l'API Django pour déclencher l'envoi de l'email de réinitialisation
      await axios.post(`${API_URL}/password/reset/`, { email })
      setSuccess(true)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Erreur axios:', err.response?.data)
        setError("Une erreur est survenue. Vérifie l'email.")
      } else {
        console.error('Erreur inconnue:', err)
        setError('Une erreur inattendue est survenue.')
      }
    }
  }

  return (
    <div className='bg-gray-50 flex items-center justify-center min-h-screen px-4'>
      <div className='bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-sm w-full flex flex-col gap-6'>
        <h2 className='text-3xl font-semibold text-center text-gray-900'>Mot de passe oublié</h2>
        <p className="text-center text-gray-600 text-sm">
          Entre ton adresse email pour recevoir un lien de réinitialisation.
        </p>

        {/* Affichage du succès */}
        {success ? (
          <div className='text-green-600 text-sm text-center bg-green-50 border border-green-200 p-3 rounded-md'>
            Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.
          </div>
        ) : (
          // Formulaire de saisie de l'adresse email
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            {/* <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse email
            </label> */}
            <input
              id='email'
              type='email'
              placeholder='exemple@gmail.com'
              className="border border-gray-300 px-4 py-2 rounded-md text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Met à jour l'état à chaque saisie
              required
            />
            {/* Affiche un message d’erreur s’il y en a */}
            {error && (<p className='text-red-500 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-md'>{error}</p>)}
            {/* Bouton d'envoi du formulaire */}
            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700'>
              Envoyer le lien
            </button>
          </form>
        )}

        {/* Lien retour login */}
        <p className="text-center text-sm text-gray-500">
          Tu te souviens de ton mot de passe ?{" "}
          <a href="/signin" className="text-blue-600 hover:underline font-medium">
            Connecte-toi
          </a>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage