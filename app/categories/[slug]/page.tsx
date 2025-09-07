import React from 'react';
import CategoryBtn from '@/components/category/CategoryBtn';
import ProductCard from '@/components/home/ProductCard';
import { getFullImageUrl } from '@/lib/getFullImageUrl';
import Link from "next/link"
import { Product } from '@/lib/types';
import { getCategory } from '@/lib/api';


interface SubCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  description?: string;
  subcategories?:SubCategory[];
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
  const category: Category | null = await getCategory(slug);

  // Récupérer les produits par catégorie (tag)
  const productsRes = await fetch(`${apiUrl}/products/by-tag/${slug}/`, { cache: 'no-store' });
  const productsData = await productsRes.json();
  const products: Product[] = productsData.results || productsData;

  // Récupérer toutes les catégories (pour les boutons)
  const categoriesRes = await fetch(`${apiUrl}/tags/`, { cache: 'no-store' });
  const categories: Category[] = await categoriesRes.json();

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      {/* Titre de la catégorie */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8 capitalize">
        {slug}
      </h1>

      {/* Sous-catégories */}
      {category && category.subcategories && category.subcategories.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Sous-catégories
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {category.subcategories.map((sub) => (
              <Link key={sub.id} href={`/categories/${sub.slug}`}>
                <div className="border rounded-lg p-3 text-center hover:bg-gray-100 transition cursor-pointer">
                  <img
                    src={getFullImageUrl(sub.image)}
                    alt={sub.name}
                    className="w-24 h-24 object-cover mx-auto mb-2 rounded"
                  />
                  <p className="text-sm font-medium">{sub.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

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
