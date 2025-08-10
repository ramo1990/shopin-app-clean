'use client'

import React, { useEffect, useState } from 'react'
import Image from "next/image"
import Button from '../uiComponents/Button'
import { useCartContext } from '@/context/CartContext'


interface ProductInfoProps{ 
  product: {
    id: number
    title: string
    price: string
    image: string
    description?: string
  }
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const { addToCart } = useCartContext()
  // const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()

  const [hydrated, setHydrated] = useState(false)

  useEffect (() => {
    setHydrated(true)
  }, [])

  // const inWishlist = isInWishlist(product.id)

  if (!hydrated) return null // ou un loader

  return (
    <section className='bg-gray-50 py-10 px-4 sm:px-8 md:px-12 lg:px-20'>
      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row gap-12'>

        {/* Image du produit */}
        <div className='w-full max-w-[400px] h-[450px] relative rounded-xl shadow-md overflow-hidden border border-gray-200'>
          <Image
            src={product.image}
            alt={product.title}
            fill
            // unoptimized
            className='object-cover rounded-xl'
            sizes='(max-width: 768px) 100vw, 400px'
          />
        </div>

        {/* Détails du produit */}
        <div className='flex flex-1 flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <h1 className='text-3xl font-bold text-gray-900'>{product.title}</h1>
            <p className='text-2xl font-semibold text-green-600'>Prix : {product.price} €</p>
          </div>

          <div className='text-gray-700'>
            <h3 className='text-lg font-semibold mb-1'>Détails</h3>
            <p className='leading-relaxed text-sm'>
              {product.description || "Aucune description disponible."}
            </p>
          </div>

          {/* Boutons */}
          <div className='flex flex-wrap gap-4 mt-4'>
            <Button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition text-sm"
              onClick={() => {
                console.log("Ajout au panier demandé:", product.id);
                  addToCart({
                    // id: product.id,
                    product_id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: 1,
                  })
                }}>
              Ajouter au panier
            </Button>

            {/* liste de souhait */}
            {/* {hydrated && (
              <Button className="bg-white border border-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-100 transition text-sm"
                onClick={() => {
                  if (inWishlist) {
                    removeFromWishlist(product.id)
                  } else {
                      addToWishlist({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.image,
                      })
                    }
                }}>
                {inWishlist ? 'Retirer de la wishlist' : 'Ajouter à la wishlist'}
              </Button>
            )} */}
          </div>
        </div>
      </div>
    </section>
    
  )
}

export default ProductInfo
