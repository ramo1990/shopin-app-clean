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
      className='flex items-center gap-3 px-5 py-3 rounded-xl border border-gray-200 shadow-sm bg-white 
                  hover:bg-blue-50 hover:border-blue-300 active:scale-95 transition-all duration-200 group'
      aria-label={`Catégorie : ${name}`}>

        <div className="w-9 h-9 relative flex-shrink-0">
            <Image src={imageUrl} alt={name} width={32} height={32} sizes="32px" 
            className='object-contain rounded-md group-hover:scale-110 transition-transform duration-200' />
        </div>

      <span className="font-medium text-gray-800 text-sm sm:text-base group-hover:text-blue-600">
        {name}
      </span>
    {/* </button> */}
    </Link>
  )
}

export default CategoryBtn
