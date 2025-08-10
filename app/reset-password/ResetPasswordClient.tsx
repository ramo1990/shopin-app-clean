"use client"  // Indique à Next.js que ce composant est côté client (pour pouvoir utiliser des hooks)

/* Ce que fait ce composant :
    Lit uid et token depuis l'URL envoyée dans l'email.
    Permet à l’utilisateur de saisir un nouveau mot de passe (et confirmation).
    Envoie une requête à Django (dj-rest-auth) pour confirmer la réinitialisation.
    Affiche un message de succès et redirige automatiquement vers /signin. 
*/
import React, { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import PasswordField from '@/components/password/PasswordField'
import type { AxiosError } from 'axios'


const API_URL = process.env.NEXT_PUBLIC_API_URL;
// Composant de la page de réinitialisation du mot de passe
const ResetPasswordPage = () => {
  // États pour stocker les deux mots de passe saisis
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  // États pour gérer les erreurs et le succès
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  // Récupération des paramètres `uid` et `token` de l'URL
  const uid = searchParams.get('uid')
  const token = searchParams.get('token')

  // Fonction exécutée lors de la soumission du formulaire
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()

    // Vérifie que les deux mots de passe sont identiques
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    try {
      // Envoie de la requête à l'API Django pour réinitialiser le mot de passe
      // await axios.post('http://127.0.0.1:8000/api/password/reset/confirm/', { // local
      await axios.post(`${API_URL}/password/reset/confirm/`, {
        uid,
        token,
        new_password1: newPassword,
        new_password2: confirmPassword,
      })
      // Si la requête est réussie, affiche un message de succès et redirige vers /signin
      setSuccess(true)
      setError('')
      setTimeout(() => router.push('/signin'), 3000)
    } catch (err: unknown) {
      const axiosError = err as AxiosError
      console.error(axiosError)
    
      // Optionnel : afficher un message plus précis
      if (axiosError.response?.data) {
        setError("Erreur : " + JSON.stringify(axiosError.response.data))
      } else {
        setError("Erreur lors de la réinitialisation.")
      }
    }
  }

  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-50 px-4'>
      <div className='bg-white shadow-lg rounded-lg p-6 max-w-md w-full'>
        <h1 className='text-xl font-semibold mb-4'>Réinitialiser le mot de passe</h1>

        {/* Message affiché si la réinitialisation a réussi */}
        {success ? (
          <p className='text-green-600'>Mot de passe mis à jour. Redirection...</p>
        ) : (
          // Formulaire de saisie des nouveaux mots de passe
          <form onSubmit={handleReset} className='space-y-4'>
            {/* <input
              type='password'
              placeholder='Nouveau mot de passe'
              className='w-full px-4 py-2 border border-gray-300 rounded'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            /> */}
            <PasswordField password={newPassword} setPassword={setNewPassword}/>

            {/* <input
              type='password'
              placeholder='Confirmer le mot de passe'
              className='w-full px-4 py-2 border border-gray-300 rounded'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            /> */}
            <PasswordField password={confirmPassword} setPassword={setConfirmPassword}/>
            
            {/* Affichage du message d'erreur si besoin */}
            {error && <p className='text-red-600 text-sm'>{error}</p>}
            {/* Bouton de validation */}
            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
            >
              Réinitialiser
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPasswordPage
