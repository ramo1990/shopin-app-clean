"use client"

import CategorySection from '@/components/home/CategorySection'
import Hero from '@/components/home/Hero'
import ProductsSection from '@/components/home/ProductsSection'
import React, {useEffect, useState} from 'react'
import { Product } from '@/lib/types'


const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // const res = await fetch('http://127.0.0.1:8000/api/products/'); // local
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`); // prod
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Erreur récupération produits:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
    <Hero />
    <div className='h-3' />
    <CategorySection />
    <div className='h-10' />
    <ProductsSection title="Nos Produits" products={products}/>
    </>
  )
}

export default HomePage
