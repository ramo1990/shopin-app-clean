/* cette fonction sert:
  À garder un utilisateur connecté automatiquement tant que le token de rafraîchissement est valide.
  À prévenir les erreurs 401 Unauthorized dues à l’expiration du token d’accès.
  Elle peut être utilisée dans un intercepteur axios, dans un fetchUser(), ou avant chaque appel protégé à l'API.
 */

// import axios from 'axios'
// On utilise notre instance Axios personnalisée avec l'intercepteur de token
import axiosPublic from "./axiosPublic"

// Fonction utilitaire pour vérifier si le token d'accès est encore valide,
// et sinon, tenter de le rafraîchir automatiquement avec le token de rafraîchissement.
export const refreshTokenIfNeeded = async (): Promise<string | null> => {
  // Récupération du token d'accès et du token de rafraîchissement depuis le localStorage
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')

  // Si l’un des deux tokens est absent, on ne peut rien faire
  if (!accessToken || !refreshToken) return null

  try {
    // Optionnel : appel pour vérifier que le token est encore valide
    //ou Tentative de vérification du token d'accès via l'endpoint de vérification du backend Django
    await axiosPublic.post('/token/verify/', {token: accessToken})
    // Si la vérification réussit, le token est toujours valide : on le retourne
    return accessToken // toujours valide
  } catch {
    // Si on entre ici, c'est que le token d'accès est invalide ou expiré
    try {
      // Le token est expiré, on essaie de le rafraîchir (autre explication) On tente de le rafraîchir en envoyant le token de rafraîchissement au backend
      const res = await axiosPublic.post('/token/refresh/', {refresh: refreshToken})

      // Si tout se passe bien, on récupère un nouveau token d'accès
      const newAccessToken = res.data.access

      // On met à jour le token dans le localStorage
      localStorage.setItem('accessToken', newAccessToken)

      // On retourne le nouveau token
      return newAccessToken
    } catch (refreshErr) {
      // Si le refresh échoue (ex: token expiré ou invalide), on affiche une erreur
      console.error('Erreur lors du refresh token :', refreshErr)
      return null
    }
  }
}
