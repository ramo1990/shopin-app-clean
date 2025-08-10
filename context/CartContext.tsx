'use client'

import { createContext, useContext, useState, useEffect, ReactNode} from 'react'
import axiosInstance from '@/lib/axiosInstance'
import { useAuth } from './AuthContext'
import { refreshTokenIfNeeded } from '@/lib/auth'

export interface CartItem {
  id?: number
  product_id: number
  title: string
  price: string
  image: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  updateQuantity: (productId: number, qty: number) => Promise<void>
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const { user } = useAuth()
  const [error, setError] = useState<string | null>(null)

  // useEffect(() => {
  //   if (user) {
  //     fetchCart()
  //   }
  // })

  // ✅ Déclaré ici pour pouvoir le réutiliser
  const fetchCart = async () => {
    const token = await refreshTokenIfNeeded()
    if (!token || !user) {
      setCart([])
      return
    }

    try {
      const res = await axiosInstance.get('cart/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCart(res.data)
    } catch (err) {
      console.error('Erreur de chargement du panier :', err)
      setCart([])
    }
  }

  useEffect(() => {
    fetchCart()
  }, [user])

  const addToCart = async (item: CartItem) => {
    console.log('Début addToCart:', item);
    try {
      const token = await refreshTokenIfNeeded();
      if (!token) {
        alert('Vous devez être connecté pour ajouter un produit au panier.');
        return;
      }
  
      const existing = cart.find(p => p.product_id === item.product_id);
  
      if (existing) {
        console.log('Produit déjà dans le panier, mise à jour quantité...');
        const res = await axiosInstance.patch(`cart/${existing.id}/`, {
          quantity: existing.quantity + item.quantity,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Quantité mise à jour:', res.data);
      } else {
        console.log('Produit non présent, ajout...');
        const res = await axiosInstance.post('cart/', {
          product: item.product_id,
          quantity: item.quantity,
          
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Produit ajouté:', res.data);
      }
  
      await fetchCart();
      console.log('Panier rechargé', cart);
    } catch (err) {
      setError("Erreur lors de l'ajout au panier");
      console.error('❌ Erreur addToCart:', err);
    }
  };
  
  

  const removeFromCart = async (itemId: number) => {
    const token = await refreshTokenIfNeeded()
    if (!token) return

    await axiosInstance.delete(`cart/${itemId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    await fetchCart() // 🔁
  }

  const updateQuantity = async (itemId: number, qty: number) => {
    const token = await refreshTokenIfNeeded()
    if (!token) return
  
    await axiosInstance.patch(`cart/${itemId}/`, {
      quantity: qty
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
  
    await fetchCart()
  }

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCartContext must be used within CartProvider')
  return context
}
