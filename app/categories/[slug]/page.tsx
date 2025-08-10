import React from 'react';
import CategoryBtn from '@/components/category/CategoryBtn';
import ProductCard from '@/components/home/ProductCard';
import { getFullImageUrl } from '@/lib/getFullImageUrl';
import Link from "next/link"
import { Product } from '@/lib/types';
import { getCategory } from '@/lib/api';


interface Category {
  id: number;
  name: string;
  image: string;
  description?: string;
}

interface Params {
  slug: string;
}

interface CategoryPageProps {
  params: Promise<Params>;
}

export async function generateMetadata({ params }: {params: Promise<Params>}){
  const resolveParams = await params;
  const { slug } = resolveParams
  const category: Category = await getCategory(slug)

  if (!category) {
    return {
      title: 'Catégorie introuvable | Shopin',
      description: 'La catégorie demandée est introuvable.',
    }
  }

  return {
    title: `${category.name} | Shopin`,
    description: category.description || 'Détail du categorie'
  }

}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const CategoryPage = async ({ params }:  CategoryPageProps) => {
  const { slug } = await params;

  // Récupérer les produits par catégorie (tag)
  // const productsRes = await fetch(`http://127.0.0.1:8000/api/products/by-tag/${slug}/`, { cache: 'no-store' }); // local
  const productsRes = await fetch(`${apiUrl}/products/by-tag/${slug}/`, { cache: 'no-store' });
  const productsData = await productsRes.json();
  const products: Product[] = productsData.results || productsData;

  // Récupérer toutes les catégories (pour les boutons)
  // const categoriesRes = await fetch('http://127.0.0.1:8000/api/tags/', { cache: 'no-store' }); // local
  const categoriesRes = await fetch(`${apiUrl}/tags/`, { cache: 'no-store' });
  const categories: Category[] = await categoriesRes.json();

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      {/* Titre de la catégorie */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8 capitalize">
        {slug}
      </h1>

      {/* Boutons pour autres catégories */}
      <div className='flex flex-wrap justify-center gap-4 mb-10'>
        {categories.map(cat => (
          <CategoryBtn
            key={cat.id}
            name={cat.name}
            imageUrl={getFullImageUrl(cat.image)} 
          />
        ))}
      </div>

      {/* Produits de la catégorie */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {products.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            Aucun produit trouvé pour cette catégorie.
          </p>
        ) : (
          products.map(product => (
            <Link key={product.id} href={`/products/${product.slug}`}>
              <ProductCard /*key={product.id}*/ product={product} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
