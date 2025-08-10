// Fichier de gestion du contexte d'authentification pour une app Next.js côté client
'use client' 

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useCartContext } from './CartContext' // (optionnel) pour vider le panier à la déconnexion

// Définition de l'interface d'un utilisateur typé
interface User {
  name: string
  first_name: string
  email: string
  image?: string // champ optionnel
}

// Définition de ce que contiendra le contexte d'authentification
interface AuthContextType {
    user: User | null    // utilisateur connecté ou null
    loading: boolean     // pour indiquer si la vérification initiale est en cours
    login: (token: string, user: User) => void    // fonction de connexion
    logout: () => void     // fonction de déconnexion
    token: string | null   // token JWT actuel
    // signInWithGoogle: () => void
}

// Création du contexte (non encore rempli)
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  // const {data: session, status} = useSession()
  const [loading, setLoading] = useState(true)   // au début, l’état est "en chargement"
  // const [loading, setLoading]= useState(true)


  // Initialisation uniquement pour JWT local (si OAuth non utilisé)
  useEffect(() => {
    // if (typeof window === 'undefined') return
    
    // if (!session) {
    try {
      const storedToken = localStorage.getItem('accessToken')
        const storedUser = localStorage.getItem('user')
        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } catch (err) {
        console.error('Erreur lors du chargement localStorage', err)
      } finally {
        setLoading(false)
      }
    }, [])

  // Fonction de connexion : stocke le token + les infos utilisateur passées depuis le backend
  const login = (token: string, user: User) => {
    try {
    localStorage.setItem('accessToken', token)  // stocke le token côté navigateur
    localStorage.setItem('user', JSON.stringify(user))
    setToken(token)
    setUser(user) // garde les vraies infos utilisateur reçues via /me/ (backend Django)
  } catch (err){
    console.error('impossible de sauvegarder le token', err)
  }
}

  // Fonction de déconnexion : supprime le token + l'utilisateur
  const logout = () => {
      try {
      // JWT local
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')  // si géré
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
      } catch (err) {
        console.error('Impossible de supprimer les données locales', err)
      }
    }

  // Fournit les valeurs du contexte à toute l'application
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personnalisé pour consommer le contexte plus facilement dans l’app
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider') // sécurité
  return context
}
