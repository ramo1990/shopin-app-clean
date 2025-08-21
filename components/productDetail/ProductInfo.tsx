'use client'

import React, { useEffect, useState } from 'react'
import Image from "next/image"
import Button from '../uiComponents/Button'
import { useCartContext } from '@/context/CartContext'
import { getFullImageUrl } from '@/lib/getFullImageUrl' 
import { ProductImage, ProductVariant } from '@/lib/types'
import { Truck, RotateCcw, LockKeyhole } from 'lucide-react'


interface ProductInfoProps { 
  product: {
    id: number
    title: string
    price: string
    image: string
    description?: string
    images: ProductImage[]
    variants?: ProductVariant[]
    stock: number
    available: boolean
  }
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const { addToCart } = useCartContext()
  const [hydrated, setHydrated] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  
  useEffect(() => {
    setHydrated(true)

    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0]
      setSelectedVariant(firstVariant)

      if (firstVariant.image) {
        setSelectedImage(getFullImageUrl(firstVariant.image))
        return
      }
    }

    if (product.image) {
      setSelectedImage(getFullImageUrl(product.image))
    } else if (product.images?.length > 0) {
      setSelectedImage(getFullImageUrl(product.images[0].image))
    } else {
      setSelectedImage("/image_default.jpg")
    }
  }, [product])

  if (!hydrated) return null

  const displayedImage = selectedImage
  const displayedTitle = selectedVariant?.title || product.title
  const displayedPrice = selectedVariant?.price || product.price
  const displayedDescription = selectedVariant?.description || product.description || "Aucune description disponible."
  const displayedStock = selectedVariant?.stock ?? product.stock
  const isAvailable = selectedVariant?.available ?? product.available
  const displayedColor = selectedVariant?.color || "N/A"
  const displayedSize = selectedVariant?.size || "N/A"

  return (
    <section className='bg-gray-50 py-10 px-4 sm:px-8 md:px-12 lg:px-20'>
      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row gap-12'>

        {/* Zone images */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Miniatures */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto">
            {[product.image, ...(product.images?.map(img => img.image) || [])]
              .filter(Boolean)
              .map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(getFullImageUrl(img!))}
                  className={`relative w-20 h-20 rounded-md border-2 overflow-hidden transition 
                  ${selectedImage === getFullImageUrl(img!) ? 'border-blue-500' : 'border-gray-200'}`}
                >
                  <Image
                    src={getFullImageUrl(img!)}
                    alt={`Aperçu ${idx}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
          </div>

          {/* Image principale */}
          <div className="relative w-full max-w-2xl h-[500px] rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <Image
              src={displayedImage}
              alt={displayedTitle}
              fill
              className="object-contain bg-white"
              sizes="(max-width: 768px) 100vw, 1000px"
            />
          </div>
        </div>

        {/* Détails produit */}
        <div className='flex flex-1 flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <h1 className='text-3xl font-bold text-gray-900'>{displayedTitle}</h1>
            <p className='text-2xl font-semibold text-green-600'>{displayedPrice} €</p>

            <div className="text-sm text-gray-700 mt-2">
              <p>Couleur : {displayedColor}</p>
              <p>Taille : {displayedSize}</p>
              <p>Stock : {displayedStock > 0 ? `${displayedStock} en stock` : "Rupture de stock"}</p>
              <p>Disponibilité : {isAvailable ? "Disponible" : "Indisponible"}</p>
            </div>
          </div>

          {/* Miniatures des variantes */}
          <div className="flex gap-3 mb-4 overflow-x-auto">
            {/* Produit principal */}
            <button
              onClick={() => {
                setSelectedVariant(null)
                if (product.image) {
                  setSelectedImage(getFullImageUrl(product.image))
                } else if (product.images?.length > 0) {
                  setSelectedImage(getFullImageUrl(product.images[0].image))
                } else {
                  setSelectedImage("/image_default.jpg")
                }
              }}
              className={`relative w-20 h-20 rounded-md border-2 overflow-hidden transition 
                ${selectedVariant === null ? 'border-blue-500' : 'border-gray-300'}`}
            >
              <Image
                src={
                  product.image
                    ? getFullImageUrl(product.image)
                    : product.images?.length > 0
                    ? getFullImageUrl(product.images[0].image)
                    : "/image_default.jpg"
                }
                alt="Produit principal"
                fill
                className="object-cover"
              />
            </button>

            {/* Variante(s) */}
            {product.variants?.map((variant) => {
              const variantImage =
                variant.image ||
                product.image ||
                (product.images?.length > 0 ? product.images[0].image : null)

              return (
                <button
                  key={variant.id}
                  onClick={() => {
                    setSelectedVariant(variant)
                    if (variant.image) {
                      setSelectedImage(getFullImageUrl(variant.image))
                    } else if (product.image) {
                      setSelectedImage(getFullImageUrl(product.image))
                    } else if (product.images?.length > 0) {
                      setSelectedImage(getFullImageUrl(product.images[0].image))
                    } else {
                      setSelectedImage("/image_default.jpg")
                    }
                  }}
                  className={`relative w-20 h-20 rounded-md border-2 overflow-hidden transition 
                    ${selectedVariant?.id === variant.id ? 'border-blue-500' : 'border-gray-300'}`}
                >
                  <Image
                    src={
                      variantImage
                        ? getFullImageUrl(variantImage)
                        : "/image_default.jpg"
                    }
                    alt={`Variante ${variant.id}`}
                    fill
                    className="object-cover"
                  />
                </button>
              )
            })}
          </div>

          {/* Description */}
          <div className='text-gray-700'>
            <h3 className='text-lg font-semibold mb-1'>Détails</h3>
            <p className='leading-relaxed text-sm'>
              {displayedDescription}
            </p>
          </div>

          {/* Bouton panier */}
          <div className='flex flex-wrap gap-4 mt-4'>
            <Button
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition text-sm"
              onClick={() => {
                addToCart({
                  product_id: product.id,
                  title: displayedTitle,
                  price: displayedPrice,
                  image: displayedImage || "/image_default.jpg",
                  quantity: 1,
                  variant_id: selectedVariant?.id,
                })
              }}
            >
              Ajouter au panier
            </Button>
          </div>

          {/* Avantages (livraison, retour, paiement) */}
          <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-6 mt-8">
            <div className="flex items-center gap-3">
            <Truck className="text-gray-700" size={32} />
              <div>
                <p className="text-sm font-semibold text-gray-800">Livraison gratuite</p>
                <p className="text-xs text-gray-500">À partir de 50€ d'achat</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
            <RotateCcw className="text-gray-700" size={32} />
              <div>
                <p className="text-sm font-semibold text-gray-800">Retour gratuit</p>
                <p className="text-xs text-gray-500">Sous 14 jours</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
            <LockKeyhole className="text-gray-700" size={32} />
              <div>
                <p className="text-sm font-semibold text-gray-800">Paiement sécurisé</p>
                <p className="text-xs text-gray-500">SSL & cryptage bancaire</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default ProductInfo