'use client'

import React, { useState } from 'react'
import { useCartContext } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'
import { refreshTokenIfNeeded } from '@/lib/auth'
import { useAuth } from '@/context/AuthContext'


// interface CartSummaryProps {}

const CartSummary = () => {
  const { cart, clearCart } = useCartContext()
  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const subtotal = cart.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0)
  const estimatedTax = subtotal * 0.05
  const total = subtotal + estimatedTax

  const handleCheckout = async () => {
    console.log("🛒 Checkout button clicked")
    const token = await refreshTokenIfNeeded();
    const paymentMethod = 'card'
  
    if (!token) {
      alert('Veuillez vous connecter pour continuer.');
      return;
    }
    
    
    try {
      // Vérifier si une adresse existe
      const res = await axiosInstance.get('/shipping-address/', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (res.data.length === 0) {
        // Pas d’adresse, rediriger vers le formulaire
        router.push('/checkout');
      } else {
        // Adresse présente, créer commande
        const addressId = res.data[0].id;
  
        const order = await axiosInstance.post('/orders/', {
          shipping_address_id: addressId,
          payment_method: paymentMethod,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log('Commande créée:', order.data)

        clearCart();
        router.push(`/payment/${order.data.order_id}`);
      }
    } catch (err) {
      console.error('Erreur lors du passage de commande:', err);
      setError("Erreur lors du passage de la commande.");
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Résumé de la commande</h2>

      <div className='flex justify-between mb-2'>
        <span>Articles :</span>
        <span>{cart.length}</span>
      </div>

      <div className="flex justify-between text-gray-700">
        <p>Sous-total</p>
        <p>{subtotal.toFixed(2)} $</p>
      </div>

      <div className="flex justify-between text-gray-700">
        <p>Tax estimée</p>
        <p>{estimatedTax.toFixed(2)} $</p>
      </div>

      <hr className='my-4 border-gray-300' />

      <div className='flex justify-between font-semibold text-lg text-gray-900'>
        <p>Total</p>
        <p>{total.toFixed(2)} $</p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleCheckout}
        className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition font-medium"
        disabled={!user || total < 0}
      >
        Passer la commande
      </button>
    </div>
  )
}

export default CartSummary
