"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { getOrderByCustomId } from "@/lib/api"
import Link from "next/link"
import { OrderType } from "@/lib/types"

export default function ConfirmationPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<OrderType | null>(null)
  const isCancelled = searchParams.get("responsecode") === "-1"

  // Redirection si paiement annulé
  useEffect(() => {
    if (isCancelled) {
      const timeout= setTimeout(() => {
        router.replace("/checkout")
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [isCancelled, router])

  // Charger la commande
  useEffect(() => {
    async function fetchOrder() {
      try {
        const rawId = params?.order_id
        if (!rawId) {
          router.push('/sigin') // redirige si pas d'ID
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
    if (!isCancelled) {
      fetchOrder()
    }
  }, [params?.order_id, router, isCancelled])

  // N'affiche rien si on redirige
  if (isCancelled) {
    return (
      <section className="max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-red-600">Paiement annulé</h1>
        <p className="text-gray-600 mt-2">Redirection vers la page de commande...</p>
      </section>
    )
  }
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
