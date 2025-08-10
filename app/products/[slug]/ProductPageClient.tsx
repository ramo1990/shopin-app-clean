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

  useEffect(() => {
    const loadData = async () => {
      // const token = await refreshTokenIfNeeded()
      // if (!token) {
      //   console.warn('Token JWT manquant : utilisateur non connecté')
      // return
      // }
      setLoading(true)
      setError(null)
      try{
        const res = await axiosInstance.get(`/products/${slug}/`)
      const prod = res.data
      setProduct(prod)

      if (prod?.tags?.length) {
        const similarRes = await axiosInstance.get(`/products/by-tag/${prod.tags[0].name}/`)
        setSimilarProducts(similarRes.data.results || [])
        }
      } catch (e) {
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
