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
  const fullImageUrl = getFullImageUrl(imageUrl);
  
  return (
    <Link href={`/categories/${slug}`}>
      <div className='w-[200px] h-[160px] bg-white rounded-2xl shadow-sm hover:shadow-xl transition-transform duration-300
                     flex flex-col items-center justify-center cursor-pointer hover:scale-105 border border-gray-100'>

          {/* Category Icon */}
          <div className="w-16 h-16 relative rounded-full overflow-hidden ring-2 ring-gray-100">
              <Image src={fullImageUrl}
               alt={name} fill className='object-cover' sizes="64px"/>
          </div>
        
          {/* Category Name */}
          <p className='font-semibold mt-4 text-gray-800 text-center text-sm md:text-base'> {name}</p>
      </div>
    </Link>
  )
}

export default CategoryCard
