"use client";

import React from 'react'
import Image from "next/image"
import Link from 'next/link'


interface CategoryBtnProps {
  name: string;
  imageUrl: string;
}

const CategoryBtn: React.FC<CategoryBtnProps> = ({ name, imageUrl }) => {

  return (
    <Link href={`/categories/${name.toLowerCase()}`}
      className='flex items-center gap-3 px-4 py-2 rounded-lg border border-gray-200 shadow-sm bg-white hover:bg-gray-100 
        transition-all duration-200'
      aria-label={`Catégorie : ${name}`}>

        <div className="w-8 h-8 relative">
            <Image src={imageUrl} alt={name} width={32} height={32} sizes="32px" className='object-contain rounded' />
        </div>

      <span className="font-medium text-gray-800 text-sm sm:text-base">
        {name}
      </span>
    {/* </button> */}
    </Link>
  )
}

export default CategoryBtn
