'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axiosInstance from '@/lib/axiosInstance'
import { useAuth } from './AuthContext'
import { refreshTokenIfNeeded } from '@/lib/auth'
import { CartItem } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  updateQuantity: (productId: number, qty: number) => Promise<void>
  clearCart: () => void
  fetchCart: () => Promise<void>
  onCartChange?: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children, onCartChange }: { children: ReactNode, onCartChange?: () => void }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const { user, loading: authLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isClientReady, setIsClientReady] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClientReady(true)
    }
  }, [])

  // 🔄 Crée un ID anonyme unique si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!user) {
      const existing = localStorage.getItem('anonymous_user_id')
      if (!existing) {
        const anonId = uuidv4()
        localStorage.setItem('anonymous_user_id', anonId)
      }
    }
  }, [user]) 

  // ✅ Fetch panier (connecté ou non)
  const [isFetching, setIsFetching] = useState(false)

  const fetchCart = async () => {
    console.log("🔄 Tentative de fetchCart");
    if (typeof window === 'undefined') return
    if (isFetching) {
      console.log("⏳ fetchCart annulé : déjà en cours");
      return
    }
    if (authLoading) {
      console.log("⏳ fetchCart annulé : authLoading en cours");
      return
    }

    try {
      setIsFetching(true)
      console.log('→ fetchCart appelé')
      console.log('fetchCart appelé, user:', user)

      const token = await refreshTokenIfNeeded()
      console.log('Token utilisé pour fetchCart:', token)

      const headers: Record<string, string> = {}
      let url = 'cart/'

      if (user) {
          // 🛑 Si l'utilisateur est connecté mais token manquant → ne rien faire
        if (!token) {
          console.warn('Utilisateur connecté mais pas de token : fetchCart annulé')
          return
        }
        headers['Authorization'] = `Bearer ${token}`
      } else {
        // Mode anonyme
        const anonId = localStorage.getItem('anonymous_user_id')
        if (!anonId) {
          console.warn('Pas d\'anonymous_user_id, fetchCart annulé')
          return
        }
        url += `?anonymous_user_id=${anonId}`
      }

      const res = await axiosInstance.get(url, { headers })
      setCart(res.data)
      console.log('Panier chargé:', res.data)
    } catch (err) {
      console.error('Erreur de chargement du panier :', err)
      setCart([])
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    if (isClientReady && !authLoading) {
      fetchCart()
    }
  }, [isClientReady ,user, authLoading]) // refetch panier si user change
  
  console.log('Panier avant fusion :', cart)
  
  // Fusion automatique du panier anonyme après login
  useEffect(() => {
    const mergeCartAfterLogin = async () => {
      const token = await refreshTokenIfNeeded()
      const anonId = localStorage.getItem('anonymous_user_id')
      if (!token || !anonId) return

      try {
        const res = await axiosInstance.post(
          'cart/merge/',
          { anonymous_user_id: anonId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        localStorage.removeItem('anonymous_user_id')
        console.log('Panier anonyme fusionné avec succès')
        
        await fetchCart()
      } catch (err) {
        console.error('Erreur fusion panier dans CartContext :', err)
      }
    }

    if (user) {
      mergeCartAfterLogin()
    }
  }, [user])

  // Ajout au panier (connecté ou non)
  const addToCart = async (item: CartItem) => {
    console.log('Début addToCart dans cartcontext:', item)
    try {
      const token = await refreshTokenIfNeeded()
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const existing = cart.find(p => p.product_id === item.product_id)

      if (existing) {
        console.log('Produit déjà dans le panier, mise à jour quantité...')
        await axiosInstance.patch(`cart/${existing.id}/`, {
          quantity: existing.quantity + item.quantity,
        }, { headers })
      } else {
        console.log('Produit non présent, ajout...')
        const data: any = {
          product: item.product_id,
          quantity: item.quantity,
        }

        // Si non connecté, ajouter anonymous_user_id
        if (!token) {
          const anonId = localStorage.getItem('anonymous_user_id')
          if (anonId) {
            data.anonymous_user_id = anonId
          }
        }

        await axiosInstance.post('cart/', data, { headers })
      }

      // setTimeout(() => {
      //   fetchCart()
      // }, 100)
      
      await fetchCart()
      if (onCartChange) onCartChange()
      console.log('Panier rechargé', cart)
    } catch (err) {
      setError("Erreur lors de l'ajout au panier")
      console.error('Erreur addToCart:', err)
    }
  }

  const removeFromCart = async (itemId: number) => {
    const token = await refreshTokenIfNeeded();
    const headers: Record<string, string> = {};
    let params: Record<string, string> = {}
  
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      const anonId = localStorage.getItem('anonymous_user_id');
      if (anonId) params['anonymous_user_id'] = anonId;
    }
  
    await axiosInstance.delete(`cart/${itemId}/`, { headers, params });
    await fetchCart()
    if (onCartChange) onCartChange()
  };
  

  const updateQuantity = async (itemId: number, qty: number) => {
    try {
      const token = await refreshTokenIfNeeded();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      let params: Record<string, string> = {}
  
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        const anonId = localStorage.getItem('anonymous_user_id');
        if (anonId) params['anonymous_user_id'] = anonId;
      }
  
      const data = { quantity: qty };
  
      await axiosInstance.patch(`cart/${itemId}/`, data, { headers, params });
      await fetchCart()
      if (onCartChange) onCartChange()
    } catch (err) {
      console.error('Erreur updateQuantity:', err);
      setError("Impossible de modifier la quantité du produit.");
    }
  };  
  
  const clearCart = () => setCart([])

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCartContext must be used within CartProvider')
  return context
}