"use client"

import React, { useState } from "react"

interface Product {
  id: number
  title: string
  description: string
  price: string
  image: string
  stock: number
  slug: string
}

interface OrderItem {
  id: number
  product: Product
  quantity: number
  price: string
  total: number
  name: string
}

interface ShippingAddress {
  id: number
  full_name: string
  address: string
  city: string
  postal_code: string
  country: string
  phone: string
}

interface OrderData {
  id: number
  order_id: string
  shipping_address: ShippingAddress
  items: OrderItem[]
  total: string
  payment_method: string
  payment_status: string
  expected_delivery: string
  status: string
  created_at: string
  stripe_checkout_id: string | null
  user: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("")
  const [order, setOrder] = useState<OrderData | null>(null)
  const [error, setError] = useState("")

  const fetchOrder = async () => {
    setError("")
    setOrder(null)

    if (!orderId.trim()) {
      setError("Veuillez entrer un ID de commande.")
      return
    }

    try {
      // const res = await fetch(`http://127.0.0.1:8000/api/order-tracking/?order_id=${orderId}`) // local
      const res = await fetch(`${API_URL}/order-tracking/?order_id=${orderId}`)
      if (!res.ok) {
        if (res.status === 404) setError("Commande non trouvée.")
        else setError("Erreur lors de la récupération de la commande.")
        return
      }
      const data: OrderData = await res.json()
      setOrder(data)
    } catch (err) {
      setError("Erreur réseau ou serveur.")
      console.error(err)
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Suivi de commande</h1>

      <div className="mb-6">
        <label htmlFor="orderId" className="block mb-2 font-semibold">
          Entrez votre numéro de commande :
        </label>
        <input
          type="text"
          id="orderId"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border border-gray-400 rounded px-3 py-2 w-full max-w-sm"
          placeholder="Ex : SHOP1B71711B"
        />
        <button
          onClick={fetchOrder}
          className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Rechercher
        </button>
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </div>

      {order && (
        <section className="bg-gray-100 rounded p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">Détails de la commande {order.order_id}</h2>
          <p>
            <strong>Statut :</strong> {order.status}
          </p>
          <p>
            <strong>Méthode de paiement :</strong> {order.payment_method}
          </p>
          <p>
            <strong>Statut du paiement :</strong> {order.payment_status}
          </p>
          <p>
            <strong>Date de création :</strong>{" "}
            {new Date(order.created_at).toLocaleDateString()}
          </p>
          <p>
            <strong>Livraison estimée :</strong>{" "}
            {new Date(order.expected_delivery).toLocaleDateString()}
          </p>
          <p>
            <strong>Total :</strong> {order.total} €
          </p>

          <h3 className="mt-6 mb-2 font-semibold">Adresse de livraison</h3>
          <p>{order.shipping_address.full_name}</p>
          <p>{order.shipping_address.address}</p>
          <p>
            {order.shipping_address.postal_code} {order.shipping_address.city}
          </p>
          <p>{order.shipping_address.country}</p>
          <p>Téléphone : {order.shipping_address.phone}</p>

          <h3 className="mt-6 mb-2 font-semibold">Articles</h3>
          <ul>
            {order.items.map((item) => (
              <li key={item.id} className="mb-3 border-b border-gray-300 pb-2">
                <p>
                  <strong>{item.product.title}</strong> x {item.quantity}
                </p>
                <p>Prix unitaire : {item.price} €</p>
                <p>Total : {item.total} €</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}


// import React, { useState } from 'react'


// const OrderTrackingPage = () => {
//   const [orderNumber, setOrderNumber] = useState('')
//   const [trackingInfo, setTrackingInfo] = useState<any>(null)
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setTrackingInfo(null)
//     setError('')
//     setLoading(true)

//     if (!orderNumber.trim()) {
//       setError("Veuillez entrer un numéro de commande.")
//       setLoading(false)
//       return
//     }

//     const token = localStorage.getItem('access')
//     console.log("🛡️ Token utilisé :", token)

//     if (!token) {
//       setError("Vous devez être connecté pour suivre une commande.")
//       setLoading(false)
//       return
//     }

//     try {
//       const token = localStorage.getItem('access') // ou sessionStorage selon ton auth
//       console.log("🛡️ Token utilisé :", token)
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}tracking/${orderNumber}/`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       })
      
//       if (res.status === 404) {
//         setError("Numéro de commande introuvable.")
//       } else if (!res.ok) {
//         throw new Error('Erreur serveur')
//       } else {
//         const data = await res.json()

//       // Tu peux adapter les champs ici selon ce que renvoie ton backend
//       setTrackingInfo({
//         status: data.payment_status, // ou data.status si tu ajoutes un champ
//         estimatedDelivery: "Bientôt disponible", // à remplacer si tu ajoutes ce champ
//       })
//     }
//   } catch (err) {
//       setError("Une erreur est survenue lors du suivi de la commande.")
//     }
//     setLoading(false)
//   }

//   return (
//     <main className="max-w-xl mx-auto px-6 py-16">
//       <h1 className="text-3xl font-bold mb-6">Suivi de commande</h1>

//       <p className="text-gray-700 mb-6">
//         Entrez votre numéro de commande pour connaître son statut et la date de livraison estimée.
//       </p>

//       <form onSubmit={handleSubmit} className="space-y-4 mb-8">
//         <input
//           type="text"
//           value={orderNumber}
//           onChange={(e) => setOrderNumber(e.target.value)}
//           placeholder="Ex: 2"
//           className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
//         />
//         <button
//           type="submit"
//           className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
//           disabled={loading}
//         >
//           {loading ? "Recherche..." : "Rechercher"}
//         </button>
//       </form>

//       {error && <p className="text-red-600">{error}</p>}

//       {trackingInfo && (
//         <div className="bg-gray-100 p-6 rounded shadow-sm">
//           <h2 className="text-xl font-semibold mb-2">Statut de la commande</h2>
//           <p><strong>Statut :</strong> {trackingInfo.status}</p>
//           <p><strong>Livraison estimée :</strong> {trackingInfo.estimatedDelivery}</p>
//         </div>
//       )}
//     </main>
//   )
// }

// export default OrderTrackingPage
