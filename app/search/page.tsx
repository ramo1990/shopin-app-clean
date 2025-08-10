import ProductCard from '@/components/home/ProductCard'
import { productSearch } from '@/lib/api'
import { Product } from '@/lib/types'
import Link from 'next/link'
import React from 'react'

const SearchPage = async ({searchParams}: {searchParams: Promise<{query: string | null | undefined}>}) => {
  const {query} = await searchParams
  const searchedProducts = await productSearch(query)
  console.log(searchedProducts)

  return (
    <div className='main-max-width mx-auto padding-x py-9'>
      <p className='font-thin text-center text-xl'>Tu recherches: <span className='font-semibold'>{query}</span></p>

      <div className='flex-center flex-wrap my-9 gap-4'>
        {searchedProducts.length > 0 ? (searchedProducts.map((product: Product) => (
          <Link href={`/products/${product.slug}`} key={product.id}>
            <ProductCard product={product} />
          </Link>))
        ) : (
          <p className='font-thin text-center text-xl'>Aucun produit ne correspond à ta recherche</p>
        )}
        
      </div>
      
    </div>
  )
}

export default SearchPage