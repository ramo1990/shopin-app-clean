"use client"  // Directive Next.js pour activer les hooks dans ce composant (car c’est un Client Component)

/* Ce que fait ce composant :
    Permet à l’utilisateur d’entrer son adresse email.
    Envoie l’email à l’API de Django (/api/password/reset/ via dj-rest-auth).
    Affiche un message générique pour éviter de révéler si l’email est enregistré (bon pour la sécurité).
*/
import React, { useState } from 'react'
import axios from 'axios'


const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Composant de la page "Mot de passe oublié"
const ForgotPasswordPage = () => {
  // État local pour stocker l'email saisi par l'utilisateur
  const [email, setEmail] = useState('')
  // Indique si la requête a été effectuée avec succès
  const [success, setSuccess] = useState(false)
  // Stocke un message d'erreur à afficher à l'utilisateur
  const [error, setError] = useState('')

  // Fonction appelée lors de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Empêche le rechargement de la page
    try {
      // Envoie une requête POST à l'API Django pour déclencher l'envoi de l'email de réinitialisation
      await axios.post(`${API_URL}/password/reset/`, { email })
      // Si tout se passe bien, on indique que l'opération a réussi
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
    <div className='min-h-screen flex justify-center items-center bg-gray-50 px-4'>
      {/* Conteneur principal centré */}
      <div className='bg-white shadow-lg rounded-lg p-6 max-w-md w-full'>
        <h1 className='text-xl font-semibold mb-4'>Mot de passe oublié</h1>

        {/* Si la demande a été envoyée avec succès, afficher un message d'information */}
        {success ? (
          <p className='text-green-600'>
            Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.
          </p>
        ) : (
          // Formulaire de saisie de l'adresse email
          <form onSubmit={handleSubmit} className='space-y-4'>
            <input
              type='email'
              placeholder='Votre email'
              className='w-full px-4 py-2 border border-gray-300 rounded'
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Met à jour l'état à chaque saisie
              required
            />
            {/* Affiche un message d’erreur si la requête a échoué */}
            {error && <p className='text-red-600 text-sm'>{error}</p>}
            {/* Bouton d'envoi du formulaire */}
            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
            >
              Envoyer le lien
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage