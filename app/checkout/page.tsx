'use client'

import {useRef, useState, useEffect } from 'react'
import { refreshTokenIfNeeded } from '@/lib/auth'
import axiosInstance from '@/lib/axiosInstance'
import StripePayment from '@/components/payment/StripePayment'
import type { AxiosError } from 'axios'
import { OrderType } from '@/lib/types'


interface Address {
  id: number
  full_name: string
  address: string
  city: string
  postal_code: string
  country: string
  phone: string
}

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<OrderType | null>(null)
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null)
  const isEditing = editingAddressId !== null
  const [showAllAddresses, setShowAllAddresses] = useState(false)
  // const [cartMerged, setCartMerged] = useState(false)

  const [form, setForm] = useState({
    full_name: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    phone: '',
    payment_method: 'cod', // par défaut
  })

  const modalRef = useRef<HTMLDivElement | null>(null)
  // 🔁 Fermer le modal si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowNewAddressForm(false)
      }
    }

    if (showNewAddressForm) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNewAddressForm])

  useEffect(() => {
    const mergeCartIfNeeded = async () => {
      const token = await refreshTokenIfNeeded()
      const anonymousUserId = localStorage.getItem('anonymous_user_id') // ou cookies si tu les lis comme ça
  
      // if (!token) {
      //   setCartMerged(true)
      //   return
      // }
      
      if (anonymousUserId){
        try {
          await axiosInstance.post('/cart/merge/',{ 
            anonymous_user_id: anonymousUserId },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          console.log("✅ Panier fusionné avec succès")
          // ✅ Après fusion réussie
          localStorage.removeItem('anonymous_user_id') // ✅ maintenant on peut le supprimer
        } catch (err) {
          console.error("Erreur lors de la fusion du panier :", err)
        }
      }
      // setCartMerged(true)
    }
    
      mergeCartIfNeeded()
    }, [])

  // Récupère commande existante (redirigé depuis panier)
  useEffect(() => {
    const fetchOrderIfExists = async () => {
      const orderId = localStorage.getItem('currentOrderId')
      if (!orderId) return

      const token = await refreshTokenIfNeeded()
      if (!token) return

      try {
        const res = await axiosInstance.get(`/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setOrder(res.data)
        // localStorage.removeItem('currentOrderId')
      } catch (err) {
        console.error('Erreur chargement commande existante :', err)
      }
    }

    fetchOrderIfExists()
  }, [])

  // Récupère les adresses
  useEffect(() => {
    const fetchAddresses = async () => {
      const token = await refreshTokenIfNeeded()
      if (!token) return

      try {
        const res = await axiosInstance.get('/shipping-address/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setAddresses(res.data)
        if (res.data.length > 0) setSelectedAddressId(res.data[0].id)
      } catch (err) {
        console.error('Erreur chargement adresses :', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAddresses()
  }, [])

  const updatePaymentMethod = async (payment_method: string) => {
    if (!order) return
    const token = await refreshTokenIfNeeded()
    if (!token) return
  
    try {
      const res = await axiosInstance.patch(`/orders/${order.id}/`, {
        payment_method,
        shipping_address_id: selectedAddressId,
      }, { headers: { Authorization: `Bearer ${token}` } })
  
      setOrder(res.data)
      console.log("✅ Mode de paiement mis à jour :", res.data)
    } catch (err) {
      console.error("Erreur mise à jour mode de paiement :", err)
    }
  }  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'payment_method'){
      updatePaymentMethod(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = await refreshTokenIfNeeded()
    if (!token) return alert('Connectez-vous pour continuer.')

    try {
      let addressId = selectedAddressId
      // (Gère la création/modif d'adresse si nécessaire)
      if (showNewAddressForm) {
        // const { payment_method, ...addressOnly } = form
        const addressOnly = { ...form }
  
        if (isEditing && editingAddressId !== null) {
          // 🛠 Modification d'adresse
          const res = await axiosInstance.put(`/shipping-address/${editingAddressId}/`, addressOnly, {
            headers: { Authorization: `Bearer ${token}` },
          })
  
          setAddresses(prev =>
            prev.map(addr => addr.id === editingAddressId ? res.data : addr)
          )
          addressId = editingAddressId
          setEditingAddressId(null)
        } else {
          // ➕ Création d'une nouvelle adresse
          const res = await axiosInstance.post('/shipping-address/', addressOnly, {
            headers: { Authorization: `Bearer ${token}` },
          })
  
          setAddresses(prev => [...prev, res.data])
          addressId = res.data.id
        }
  
        setSelectedAddressId(addressId)
        setShowNewAddressForm(false)
        setForm({
          full_name: '',
          address: '',
          city: '',
          postal_code: '',
          country: '',
          phone: '',
          payment_method: form.payment_method,
        })
      }
      
      if (order) {
        const res = await axiosInstance.patch(`/orders/${order.id}/`, {
          shipping_address_id: addressId,
          payment_method: form.payment_method,
        }, {headers: {Authorization: `Bearer ${token}`},})

        setOrder(res.data)
        console.log("✅ Commande mise à jour :", res.data)
      } else {
        const res = await axiosInstance.post('/orders/',
        {
          shipping_address_id: addressId,
          payment_method: form.payment_method,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        })
      
      setOrder(res.data)
      localStorage.setItem('currentOrderId', res.data.id.toString())
      console.log("✅ Nouvelle commande créée :", res.data)
      }   
    } catch (err: unknown) {
      console.error("Erreur brute :", err)
    
      const error = err as AxiosError
    
      if (error.response) {
        console.error('Erreur lors de la création de la commande :', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        })
      } else {
        console.error('Pas de réponse du serveur. Message :', error.message)
      }
    }
  }
  

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette adresse ?")) return
  
    const token = await refreshTokenIfNeeded()
    if (!token) return alert("Non autorisé")
  
    try {
      await axiosInstance.delete(`/shipping-address/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setAddresses((prev) => prev.filter((a) => a.id !== id))
      if (selectedAddressId === id) setSelectedAddressId(null)
    } catch (err) {
      console.error("Erreur suppression adresse :", err)
    }
  }
  
  
  const paymentMethods = [
    { value: 'cod', label: 'Paiement à la livraison 🏠' },
    { value: 'card', label: 'Carte bancaire 💳' },
    { value: 'paypal', label: 'PayPal 🅿️' },
  ]
  
  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 md:px-0 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* 🧾 FORMULAIRE D’ADRESSE */}
      <div>
        <h1 className="text-2xl font-semibold mb-4">Adresse de livraison</h1>

        {isLoading ? (
          <p>Chargement des adresses...</p>
        ) : (
          <>
            {addresses.length > 0 && (
              <div className="space-y-3 mb-4">
                {addresses
                  .filter((addr) => showAllAddresses || addr.id === selectedAddressId)
                  .map((addr) => (
                    <div key={addr.id} className="border rounded p-3 space-y-2">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="shipping_address"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                        />
                        <div>
                          <p className="font-semibold">{addr.full_name}</p>
                          <p>{addr.address}, {addr.city}</p>
                          <p>{addr.postal_code}, {addr.country}</p>
                          <p>Tél : {addr.phone}</p>

                          {selectedAddressId === addr.id && (
                            <p className="text-green-600 text-sm mt-2">📦 Livré à cette adresse</p>
                          )}
                        </div>
                      </label>

                      {/* Boutons Modifier / Supprimer (affichés uniquement si toutes les adresses sont visibles) */}
                      {showAllAddresses && (
                        <div className="flex gap-2 ml-6">
                          <button
                            onClick={() => {
                              setEditingAddressId(addr.id)
                              setForm({
                                full_name: addr.full_name,
                                address: addr.address,
                                city: addr.city,
                                postal_code: addr.postal_code,
                                country: addr.country,
                                phone: addr.phone,
                                payment_method: form.payment_method,
                              })
                              setShowNewAddressForm(true)
                            }}
                            className="text-yellow-600 hover:underline text-sm"
                          >
                            ✏️ Modifier
                          </button>

                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            🗑 Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                {/* 👉 Toggle show/hide all addresses */}
                {addresses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setShowAllAddresses((prev) => !prev)}
                    className="text-blue-600 hover:underline"
                  >
                    {showAllAddresses ? 'Masquer les autres adresses ▲' : 'Changer d’adresse ▼'}
                  </button>
                )}

                <button type="button" onClick={() => setShowNewAddressForm(true)}
                  className="text-blue-600 hover:underline block mt-2">
                  ➕ Ajouter une nouvelle adresse
                </button>
              </div>
            )}


            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-3">
              <h3 className="font-semibold mb-2">Mode de paiement</h3>
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  className={`border rounded p-3 flex items-center gap-3 cursor-pointer ${
                    form.payment_method === method.value ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={method.value}
                    checked={form.payment_method === method.value}
                    onChange={handleChange}
                  />
                  <span>{method.label}</span>
                </label>
              ))}
            </div>
            {/* <button
              type="submit"
              className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Valider le mode de paiement
            </button> */}
            </form>
          </>
        )}
      </div>
      
      {/* 🪟 MODAL POUR NOUVELLE ADRESSE */}
      {showNewAddressForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div ref={modalRef}
           className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowNewAddressForm(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Nouvelle adresse</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.entries(form)
                .filter(([key]) => key !== 'payment_method')
                .map(([key, value]) => (
                  <input
                    key={key}
                    name={key}
                    placeholder={key.replace('_', ' ')}
                    value={value}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded"
                  />
                ))}
              <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full">
                Valider l’adresse
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 💳 RÉCAPITULATIF ET PAIEMENT */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Paiement</h2>
        {order ? (
  <>
    <p className="mb-2">Commande #{order.id}</p>

          {order.payment_method ? (
            <>
              <p className="font-semibold mb-4">
                Total : {order.payment_method === 'cod' ? '2.00 € (Caution)' : `${order.total} €`}
              </p>

              {order.payment_method === 'cod' && (
                <p className="text-green-700 font-semibold mb-4">
                  Paiement à la livraison sélectionné. Une caution de 2€ est demandée.
                </p>
              )}

              {order.payment_method === 'card' && (
                <StripePayment amount={parseFloat(order.total)} orderId={order.id} />
              )}

              {order.payment_method === 'paypal' && (
                <p className="text-blue-600 font-semibold mb-4">
                  Paiement PayPal sélectionné. (Composant à venir)
                </p>
                // <PayPalPayment amount={parseFloat(order.total)} orderId={order.id} />
              )}
            </>
          ) : (
            <p className="text-gray-500">Chargement du mode de paiement...</p>
          )}
        </>
      ) : (
        <p className="text-gray-500">Veuillez d’abord valider votre adresse de livraison avant de payer.</p>
      )}

      </div>
    </div>
  )
}