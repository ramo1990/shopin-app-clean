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
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const { user } = useAuth()
  const [error, setError] = useState<string | null>(null)

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
  const fetchCart = async () => {
    try {
      const token = await refreshTokenIfNeeded()
      const headers: Record<string, string> = {}
      let url = 'cart/'

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      } else {
        const anonId = localStorage.getItem('anonymous_user_id')
        if (anonId) {
          url += `?anonymous_user_id=${anonId}`
        }
      }

      const res = await axiosInstance.get(url, { headers })
      setCart(res.data)
    } catch (err) {
      console.error('Erreur de chargement du panier :', err)
      setCart([])
    }
  }

  useEffect(() => {
    fetchCart()
  }, [user]) // ✅ refetch panier si user change

  // ✅ Ajout au panier (connecté ou non)
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

      await fetchCart()
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
  
    await axiosInstance.delete(`cart/${itemId}/`, {
      headers,
      params,
    });
  
    await fetchCart();
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
  
      await axiosInstance.patch(`cart/${itemId}/`, data, {
        headers,
        params,  // 👈 ajoute l'ID anonyme ici
      });
  
      await fetchCart();
    } catch (err) {
      console.error('Erreur updateQuantity:', err);
      setError("Impossible de modifier la quantité du produit.");
    }
  };  
  

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



// 'use client'

// import { createContext, useContext, useState, useEffect, ReactNode} from 'react'
// import axiosInstance from '@/lib/axiosInstance'
// import { useAuth } from './AuthContext'
// import { refreshTokenIfNeeded } from '@/lib/auth'
// import { CartItem } from '@/lib/types'


// interface CartContextType {
//   cart: CartItem[]
//   addToCart: (item: CartItem) => Promise<void>
//   removeFromCart: (productId: number) => Promise<void>
//   updateQuantity: (productId: number, qty: number) => Promise<void>
//   clearCart: () => void
// }

// const CartContext = createContext<CartContextType | undefined>(undefined)

// export const CartProvider = ({ children }: { children: ReactNode }) => {
//   const [cart, setCart] = useState<CartItem[]>([])
//   const { user } = useAuth()
//   const [error, setError] = useState<string | null>(null)

//   // useEffect(() => {
//   //   if (user) {
//   //     fetchCart()
//   //   }
//   // })

//   // ✅ Déclaré ici pour pouvoir le réutiliser
//   const fetchCart = async () => {
//     try {
//       const token = await refreshTokenIfNeeded()
//       const headers: Record<string, string> = {}
  
//       if (token) {
//         headers['Authorization'] = `Bearer ${token}`
//       }
  
//       const res = await axiosInstance.get('cart/', { headers })
//       setCart(res.data)
//     } catch (err) {
//       console.error('Erreur de chargement du panier :', err)
//       setCart([])
//     }
//   }

//   useEffect(() => {
//     fetchCart()
//   }, [])

//   const addToCart = async (item: CartItem) => {
//     console.log('Début addToCart dans cartcontext:', item);
//     try {
//       const token = await refreshTokenIfNeeded();
//       // if (!token) {
//       //   alert('Vous devez être connecté pour ajouter un produit au panier.');
//       //   return;
//       // }
      
//       const headers: Record<string, string> = { 'Content-Type': 'application/json' };
//       if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//       }
      
//       const existing = cart.find(p => p.product_id === item.product_id);
  
//       if (existing) {
//         console.log('Produit déjà dans le panier, mise à jour quantité...');
//         // Update quantité
//         const res = await axiosInstance.patch(`cart/${existing.id}/`, {
//           quantity: existing.quantity + item.quantity,
//         }, { headers });
//         console.log('Quantité mise à jour:', res.data);
//       } else {
//         console.log('Produit non présent, ajout...');
//         // Création item panier
//         const res = await axiosInstance.post('cart/', {
//           product: item.product_id,
//           quantity: item.quantity,
          
//         }, {
//           headers
//         });
//         console.log('Produit ajouté:', res.data);
//       }
  
//       await fetchCart();
//       console.log('Panier rechargé', cart);
//     } catch (err) {
//       setError("Erreur lors de l'ajout au panier");
//       console.error('Erreur addToCart:', err);
//     }
//   };
  
  

//   const removeFromCart = async (itemId: number) => {
//     const token = await refreshTokenIfNeeded()
//     if (!token) return

//     await axiosInstance.delete(`cart/${itemId}/`, {
//       headers: { Authorization: `Bearer ${token}` }
//     })

//     await fetchCart() // 🔁
//   }

//   const updateQuantity = async (itemId: number, qty: number) => {
//     const token = await refreshTokenIfNeeded()
//     if (!token) return
  
//     await axiosInstance.patch(`cart/${itemId}/`, {
//       quantity: qty
//     }, {
//       headers: { Authorization: `Bearer ${token}` }
//     })
  
//     await fetchCart()
//   }

//   const clearCart = () => setCart([])

//   return (
//     <CartContext.Provider
//       value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
//     >
//       {children}
//     </CartContext.Provider>
//   )
// }

// export const useCartContext = () => {
//   const context = useContext(CartContext)
//   if (!context) throw new Error('useCartContext must be used within CartProvider')
//   return context
// }
