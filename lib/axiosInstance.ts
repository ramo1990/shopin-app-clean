// loginUser (connexion classique via identifiants), register (inscription manuelle).
// Ce fichier configure une instance Axios personnalisée pour communiquer avec l'API Django
// Il gère notamment l'ajout automatique du token JWT dans les en-têtes de requêtes

import axios from 'axios'


const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
// Création d'une instance Axios avec une URL de base pointant vers le backend Django local
const axiosInstance = axios.create({
  // baseURL: 'http://127.0.0.1:8000/api', // local
  baseURL: API_BASE,
})

// Intercepteur exécuté avant chaque requête sortante
axiosInstance.interceptors.request.use((config) => {
  // Vérifie qu'on est bien dans un environnement navigateur (car localStorage est côté client)
  if (typeof window !== "undefined") {
    // Récupération du token JWT stocké dans le localStorage
    const token = localStorage.getItem("accessToken")
    // Si un token est présent, on l'ajoute dans l'en-tête Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // Format attendu par Django REST Framework
    }
  }
  return config  // Retourne la configuration modifiée de la requête
})

// Exportation de l'instance Axios configurée pour être utilisée dans l'application
export default axiosInstance
