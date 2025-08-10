"use client"

import React from 'react'
import Image from "next/image"
import { OrderitemType } from '@/lib/types'
import Link from 'next/link';


const BASE_URL = 'http://localhost:8000';

const MiniProductCard = ({ item }: {item: OrderitemType}) => {
  const product = item.product
  const imageUrl = item?.product?.image 
      ? (item.product.image.startsWith('http') ? item.product.image : `${BASE_URL}${item.product.image}`)
      : "/casquette.jpeg"

  return (
    <Link href={`/products/${product.slug}`} className='block'>
      <div className='w-[180px] sm:w-[200px] rounded-xl shadow-sm hover:shadow-md bg-white flex flex-col items-center 
                  gap-3 p-4 transition duration-200 ease-in-out border border-gray-100 hover:border-gray-300'>

          {/* Image produit */}
          <div className='w-full aspect-square rounded-lg overflow-hidden'>
              <Image src={imageUrl} alt={product.title} 
                      className='w-full h-full object-cover hover:scale-105 transition-transform duration-300' width={200} height={200} />
          </div>

          {/* Nom du produit */}
          <p className='text-center text-sm sm:text-base font-semibold text-gray-800'>{product.title}</p>

        {/* Prix */}
          <p className='text-sm sm:text-[16px] text-center font-bold text-black'>{product.price} €</p>
          
      </div>
    </Link>
  )
}

export default MiniProductCard
