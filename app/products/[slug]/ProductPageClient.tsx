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
  // const [reviews, setReviews] = useState<ReviewType[]>([])
  // const [loading, setLoading] = useState<boolean>(true)

  // const fetchProduct = async () => {
  //   const token = await refreshTokenIfNeeded()
  //   console.log('token:', token)
  //   if (!token) {
  //     console.warn('Token JWT manquant : utilisateur non connecté')
  //     return
  //   }

  //   const res = await axiosInstance.get(`/products/${slug}/`)
  //   setProduct(res.data)
  //   return res.data
  // }

  // const fetchSimilarProducts = async (tagName: string) => {
  //   const res = await axiosInstance.get(`/products/by-tag/${tagName}/`)
  //   setSimilarProducts(res.data.results || [])
  // }

  // useEffect(() => {
  //   const loadData = async () => {
  //     const prod = await fetchProduct()
  //     if (prod?.tags?.length) {
  //       fetchSimilarProducts(prod.tags[0].name)
  //     }
  //   }
  //   loadData()
  // }, [slug])

  useEffect(() => {
    const loadData = async () => {
      const token = await refreshTokenIfNeeded()
      if (!token) {
        console.warn('Token JWT manquant : utilisateur non connecté')
      return
      }

      const res = await axiosInstance.get(`/products/${slug}/`)
      const prod = res.data
      setProduct(prod)

      if (prod?.tags?.length) {
        const similarRes = await axiosInstance.get(`/products/by-tag/${prod.tags[0].name}/`)
        setSimilarProducts(similarRes.data.results || [])
      }
    }
    loadData()
  }, [slug])



  if (!product) return <div>Chargement du produit...</div>

  return (
    <>
      <ProductInfo product={product} />
      <ProductsSection title="Produits de la même catégorie" products={similarProducts} />
    </>
  )
}
