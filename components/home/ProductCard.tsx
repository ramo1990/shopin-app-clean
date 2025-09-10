"use client"

import React from 'react'
import Image from "next/image"
import { getFullImageUrl } from '@/lib/getFullImageUrl';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/context/CartContext';


interface Product {
  id: number;
  title: string;
  image: string;
  price: string;
  slug?:string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({product}) => {
  const { addToCart } = useCartContext()
  const router = useRouter()
  if (!product) return null;
  
  const safeImageUrl = getFullImageUrl(product.image);

  const handleBuyNow = async () => {
    try {
      await addToCart({product_id: product.id, quantity: 1, title: product.title,
        price: product.price,
        image: product.image, });
      router.push('/cart')
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
    }
  }
  
  return (
    <div className='w-[260px] rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white border border-transparent
                   hover:border-gray-200 hover:scale-[1.02] flex flex-col items-center px-5 py-6 cursor-pointer'>
        
        {/* Product Image */}
        <div className='w-[200px] h-[200px] rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center'>
            <Image src={safeImageUrl} alt={product.title} width={200} height={200}
            className='object-cover w-full h-full transition-transform duration-300 hover:scale-105' />
        </div>
        
        {/* Product Name */}
        <p className='text-center text-base md:text-lg font-semibold mt-4 text-gray-800 line-clamp-2'>{product.title}</p>

        {/* Product Price */}
        <p className='text-lg md:text-xl text-center font-bold text-black mt-2'> {product.price} Fcfa</p>

        {/* Buy now button */}
        <button onClick={handleBuyNow}
        className='mt-4 inline-block bg-green-600 text-white text-center w-full py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200'>
            {/* bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-sm */}
            Acheter
        </button>

        
    </div>
  );
};

export default ProductCard
