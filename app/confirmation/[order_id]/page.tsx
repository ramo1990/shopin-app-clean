"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getOrderByCustomId } from "@/lib/api"
import Link from "next/link"
import { OrderType } from "@/lib/types"

export default function ConfirmationPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<OrderType | null>(null)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const rawId = params?.order_id
        if (!rawId) {
          router.push('/sigin') // ou une autre page d'erreur
          return
        }

        const orderId = Array.isArray(rawId) ? rawId[0] : rawId
        const data = await getOrderByCustomId(orderId)
        setOrder(data)
      } catch (err) {
        console.error("Erreur lors du chargement de la commande :", err)
        router.push('/signin')  // ou une page d'erreur
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params?.order_id, router])

  if (loading) return <p>Chargement...</p>

  return (
    <section className="max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Merci pour votre commande !</h1>
      <p className="text-lg">Votre numéro de commande est : <strong>{order?.order_id}</strong></p>
      <div className="mt-6 space-x-4">
        <Link href="/profile" className="px-6 py-3 rounded-full bg-green-700 text-white">Voir mes commandes</Link>
        <Link href="/" className="px-6 py-3 rounded-full bg-black text-white">Continuer mes achats</Link>
      </div>
    </section>
  )
}
