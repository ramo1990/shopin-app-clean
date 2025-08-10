"use client";

import React from 'react'
import Image from "next/image"
import Link from 'next/link'
import { getFullImageUrl } from '@/lib/getFullImageUrl';


interface CategoryCardProps {
  name: string;
  imageUrl: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, imageUrl }) => {
  const slug = name.toLowerCase();
  // const baseUrl = 'http://127.0.0.1:8000';

  // const isAbsoluteUrl = (url: string) => {
  //   try {
  //     new URL(url);
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // }

  const fullImageUrl = getFullImageUrl(imageUrl);
  // const fullImageUrl = isAbsoluteUrl(imageUrl) 
  //   ? imageUrl 
  //   : imageUrl.startsWith('/media')
  //     ? `${baseUrl}${imageUrl}`
  //     : `${baseUrl}/media/${imageUrl}`;
  
  return (
    <Link href={`/categories/${slug}`}>
      <div className='w-[200px] h-[160px] bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 
              flex flex-col items-center justify-center cursor-pointer hover:scale-105'>

          {/* Category Icon */}
          <div className="w-14 h-14 relative">
              <Image src={fullImageUrl}
               alt={name} fill className='object-cover rounded-full' />
          </div>
        
          {/* Category Name */}
          <p className='font-semibold mt-3 text-gray-800 text-center'> {name}</p>
      </div>
    </Link>
  )
}

export default CategoryCard
