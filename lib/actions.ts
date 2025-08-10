// "use server"

import { signOut, signIn } from "@/auth"
import axiosInstance from './axiosInstance'

// const API_BASE = "http://127.0.0.1:8000/api"  // URL de base de l'API Django
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

// Fonction de connexion avec identifiants classiques (username + password)
export async function loginUser(username: string, password: string) {
  try {
    // Étape 1 : Récupération des tokens JWT via l'endpoint /token/
    const response = await axiosInstance.post(`${API_BASE}/token/`, {username, password})

    const { access, refresh } = response.data

    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)

    // Étape 2 : Récupération des informations de l'utilisateur connecté
    // const userRes = await axiosInstance.get("/me/", { // test
    const userRes = await axiosInstance.get(`${API_BASE}/me/`, {
      headers: { Authorization: `Bearer ${access}` }  // Authentification avec le token d'accès
    })

    const user = userRes.data

    console.log("console dans actions.ts 🧠 User reçu depuis /me/:", user)

    // Étape 3 : Retourner les tokens et un objet `user` formaté
    return {
      access,
      refresh,
      user: {
        name: user.first_name || user.username,  // `name` est utilisé dans le AuthContext
        first_name: user.first_name,  // Pour l'affichage personnalisé
        email: user.email,
        image: user.image || "",  // Par défaut vide si pas d'image
      },
    }

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erreur de connexion :", error.message)
    } else {
      console.error("Erreur inconnue :", error)
    }
    throw error
  }
}

// Fonction pour déconnecter l'utilisateur (utilise le système NextAuth / App Router)
export async function signOutUser() {
  await signOut({ redirectTo: "/" })  // Redirection vers la page d'accueil après logout
}

// Connexion via Google (OAuth2)
export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/" })  // Redirection vers la page d'accueil après connexion
}


// Fonction d'enregistrement d'un nouvel utilisateur
export async function registerUser(data: {
  username: string
  email: string
  password: string
  first_name?: string
  last_name?: string
  phone?: string;
}) {
  const response = await axiosInstance.post("/register/", data)
  return response.data  // Renvoie les données de l'utilisateur enregistré
}
