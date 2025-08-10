"use client";

import React, { useState} from 'react'
import ProductCard from './ProductCard'
import Link from 'next/link'
import { Product } from '@/lib/types'


interface Props {
  title: string;
  products: Product[];
}

const ProductsSection = ({title, products}: Props) => {
  const ITEMS_PER_PAGE = 8; // Nombre de produits à afficher par "page"
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section id='product_section' className='w-full bg-white py-24 px-4 md:px-8 lg:px-16'>
      <div className="max-w-7xl mx-auto">
        {/* titre */}
        <h2 className='text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-12'>
            {title}
        </h2>

        {/* Produits */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center'>
        {paginatedProducts.length > 0 ? (
            paginatedProducts.map(product => (
              <Link key={product.id} href={`/products/${product.slug}`} passHref>
                <ProductCard product={product} />
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">Aucun produit disponible.</p>
          )}
        </div>

       {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded text-sm font-medium border ${
                currentPage === 1 ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'text-gray-700 border-gray-400 hover:bg-gray-100'
              }`}>
              Précédent
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded text-sm font-medium border ${
                  page === currentPage ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-700 border-gray-400 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded text-sm font-medium border ${
                  currentPage === totalPages ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'text-gray-700 border-gray-400 hover:bg-gray-100'
                }`}
              >
                Suivant
              </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default ProductsSection