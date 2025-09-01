'use client'

import React, { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axiosInstance'
import ProductsSection from '@/components/home/ProductsSection'
import ProductInfo from '@/components/productDetail/ProductInfo'
import { refreshTokenIfNeeded } from '@/lib/auth'
import { Product } from '@/lib/types'


interface ProductPageClientProps {
  slug: string
}

export default function ProductPageClient({ slug }: ProductPageClientProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // user connecter ou pas, il peut acceder aux details de produits
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try{
        const token = await refreshTokenIfNeeded()
        if (token) {
          console.log('Utilisateur connecté avec token')
        } else {
          console.log('Utilisateur non connecté')
        }

        const res = await axiosInstance.get(`/products/${slug}/`)
        const prod = res.data
        setProduct(prod)

        console.log("Tags du produit :", prod.tags)

      if (prod?.tags?.length) {
          const similarRes = await axiosInstance.get(`/products/by-tag/${prod.tags[0].slug}/`)
          const allSimilar = similarRes.data || []
          // setSimilarProducts(similarRes.data.results || [])

          console.log("Produit actuel ID:", prod.id)

          const filtered = (allSimilar as Product[]).filter((p: Product) => p.id !== prod.id)
          
          setSimilarProducts(filtered)
        }
      } catch {
        setError("Impossible de charger le produit.")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [slug])

  if (loading) return <div>Chargement du produit...</div>
  if (error) return <div>{error}</div>
  if (!product) return <div>Chargement du produit...</div>

  return (
    <>
      <ProductInfo product={product} />
      <ProductsSection title="Produits de la même catégorie" products={similarProducts} />
    </>
  )
}
