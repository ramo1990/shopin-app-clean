import axios from "axios"
import axiosInstance from "./axiosInstance"
import { refreshTokenIfNeeded } from "./auth"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL
})

// GET user by email
export async function getExistingUser(email: string | undefined | null){
    try{
        const response = await api.get(`existing_user/${email}`)
        return response.data
    }

    catch(err: unknown){
        if(err instanceof Error){
            throw new Error(err.message)
        }

        throw new Error("An unknown error occured")
    }
}

// POST new user

export async function createNewUser(data: {
    email: string | null | undefined;
    username: string | null | undefined;
    first_name: string | null | undefined;
    last_name: string | null | undefined;
    profile_picture_url: string | null ;
}){
    try{
        const response = await api.post('create_user/', data)
        return response.data
    }
    catch(err: unknown){
        if(err instanceof Error){
            throw new Error(err.message)
        }

        throw new Error("An unknown error occured")
    }
}

// recherche
export async function productSearch(searchInput: string | null | undefined){
    if (searchInput){
        try{
            const response = await api.get(`search?query=${searchInput}`)
            return response.data
        }
        catch(err: unknown){
            if(err instanceof Error){
                throw new Error(err.message)
            }
    
            throw new Error("An unknown error occured")
        }
    }
}

// Récupérer un produit par son slug
export async function getProduct(slug: string) {
    try {
        const response = await api.get(`products/${slug}/`)
        return response.data
    } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(err.message || "Erreur lors de la récupération du produit")
        }
        throw new Error("Erreur inconnue lors de la récupération du produit")
      }
}

// Récupérer une category par son slug
export async function getCategory(slug: string) {
    try {
    //   const response = await fetch(`http://127.0.0.1:8000/api/tags/${slug}/`, { // local
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/${slug}/`, {
        cache: 'no-store',
      });
  
      if (!response.ok) {
        if (response.status === 404) {
            // Retourne null si la catégorie est introuvable (plutôt que de throw)
            return null;
        }
        throw new Error(`Erreur ${response.status} lors de la récupération de la catégorie`);
      }
  
      const category = await response.json();
      return category;
    } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message || 'Erreur lors de la récupération de la catégorie')
        }
        throw new Error("Erreur inconnue lors de la récupération de la catégorie")
      }
  }
  

// recuperer la commande pour le profile page
export async function getOrders() {
    const token = await refreshTokenIfNeeded()
    if (!token) throw new Error("Utilisateur non connecté") 

    try{
        const response = await axiosInstance.get('/my-orders/', {
            headers: { Authorization: `Bearer ${token}`}
        })
        return response.data
        }
        catch (err: unknown) {
            if (err instanceof Error) {
                throw new Error(err.message || "Erreur lors de la récupération des commandes")
            }
            throw new Error("Erreur inconnue lors de la récupération des commandes")
        }
    }

// 
export async function getOrderByCustomId(order_id: string) {
    const token = await refreshTokenIfNeeded()
    if (!token) throw new Error("Utilisateur non connecté")
    
    try {
        const response = await axiosInstance.get(`/order-tracking?order_id=${order_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        })
    
        return response.data
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error || "Commande non trouvée")
        }
        throw new Error("Erreur inconnue lors de la récupération de la commande")
    }
    }
      
// Ajoute de l'adresse de livraison dans profile page
export async function addAddress(addressData: {
//  email: string | null | undefined;
    full_name: string;
    address: string;
    phone: string;
    city: string;
    postal_code: string;
    country: string;
}) {
    try{
        const token = await refreshTokenIfNeeded()
        if (!token) throw new Error("Utilisateur non connecté");
        console.log("Sending address:", addressData)
        const response = await axiosInstance.post("shipping-address/", addressData, {
            headers: {
                Authorization: `Bearer ${token}`,
              },
        })
        return response.data;
    } catch(err: unknown) {
        if(axios.isAxiosError(err) && err.response?.data){
            const errorData = err.response.data;
            if (typeof errorData === 'string') {
                throw new Error(errorData);
            }
            if (typeof errorData === 'object') {
                const messages = Object.values(errorData).flat().join('\n');
                throw new Error(messages);
            }
        }
        throw new Error("Une erreur inconnue est survenue")
    }
}

// Recuperer l'adresse
export async function getAddress() {
    const token = await refreshTokenIfNeeded()
    if (!token) throw new Error("Utilisateur non connecté")

    try {
        const response = await axiosInstance.get('shipping-address/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const addresses = response.data
        return addresses?.length > 0 ? addresses[0] : null
    } catch (err: unknown) {
        console.error("Erreur lors de la récupération de l'adresse:", err)
        if (err instanceof Error) {
            throw new Error(err.message || "Impossible de récupérer l'adresse")
        }
        throw new Error("Erreur inconnue lors de la récupération de l'adresse")
    }
}
