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
          router.push('/login') // ou une autre page d'erreur
          return
        }

        const orderId = Array.isArray(rawId) ? rawId[0] : rawId
        const data = await getOrderByCustomId(orderId)
        setOrder(data)
      } catch (err) {
        console.error("Erreur lors du chargement de la commande :", err)
        router.push('/login')  // ou une page d'erreur
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



// import Link from "next/link";

// type Params = {
//       id: string;
//   };

// type Props = {
//   params: Promise<Params>
// }

//   export default async function ConfirmationPage({ params }: Props) {
//     // Pas besoin d'await ici, mais Next.js exige la fonction async
//     const { id } = await params;
  
//     // ton fetch ou autre logique asynchrone ici (optionnel)
  
//     return (
//       <section className="main-max-width padding-x py-12 text-center">
//         <div className="max-w-xl mx-auto bg-white shadow-md p-8 rounded-lg">
//           <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-4">Merci pour votre commande !</h1>
//           <p className="text-lg text-gray-700 mb-6">Votre numéro de commande est : <strong>{id}</strong></p>
//           <div className="flex justify-center gap-4">
//             <Link href="/profile" className="inline-block px-6 py-3 rounded-full bg-green-700 text-white text-base font-medium hover:bg-green-800 transition">
//                Voir mes commandes </Link>
//             <Link href="/" className="inline-block px-6 py-3 rounded-full bg-black text-white text-base font-medium hover:bg-gray-900 transition">
//                Continuer mes achats </Link>
//           </div>
//         </div>
//       </section>
//     );
//   }

