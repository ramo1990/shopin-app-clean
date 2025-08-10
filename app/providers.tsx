'use client'

import { ReactNode } from 'react'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { AuthProvider } from "@/context/AuthContext"
import { SessionProvider } from 'next-auth/react'
// import { CartProvider } from '@/context/CartContext'


export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
      <CartProvider>
        
          <WishlistProvider>
            {children}
          </WishlistProvider>
       
      </CartProvider>
      </AuthProvider>
    </SessionProvider>
    
  )
}
