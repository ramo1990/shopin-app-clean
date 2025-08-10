'use client'

import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { refreshTokenIfNeeded } from "@/lib/auth"
import { Product } from "@/lib/types"


// interface Product {
//   id: number
//   title: string
//   description: string
//   price: string
//   image: string
//   slug: string
// }

// const getProducts = async (): Promise<Product[]> => {
//   const token = await refreshTokenIfNeeded(); // rafraîchit si besoin
//   if (!token) throw new Error('Non authentifié');
  
//   const res = await axiosInstance.get("/products/")
//   return res.data
// }

// const ProductsPage = async () => {
//   const products = await getProducts()

//   return (
//     <section className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
//       <h1 className="text-3xl font-bold mb-6">Tous les produits</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//         {/* rends chaque produit cliquable  */}
//         {products.map(product => (
//            <Link key={product.id} href={`/products/${product.slug}`}>
//             <div className="border rounded-xl p-4 shadow hover:shadow-md transition">
//               <div className="relative w-full h-64 mb-4">
//                 <Image
//                   src={product.image}
//                   alt={product.title}
//                   fill
//                   className="object-cover rounded-lg"
//                 />
//               </div>
//               <h2 className="text-xl font-semibold text-gray-800">{product.title}</h2>
//               <p className="text-green-600 font-medium mt-1">{product.price} €</p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </section>
//   )
// }

// export default ProductsPage

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await refreshTokenIfNeeded()
        if (!token) throw new Error("Non authentifié")

        const res = await axiosInstance.get("/products/")
        setProducts(res.data)
      } catch (err) {
        console.error("Erreur lors de la récupération des produits:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <p className="text-center mt-10">Chargement...</p>

  return (
    <section className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Tous les produits</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map(product => (
          <Link key={product.id} href={`/products/${product.slug}`}>
            <div className="border rounded-xl p-4 shadow hover:shadow-md transition">
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{product.title}</h2>
              <p className="text-green-600 font-medium mt-1">{product.price} €</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}