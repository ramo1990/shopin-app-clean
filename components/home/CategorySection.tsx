"use client"

import React, { useEffect, useState } from 'react';
import CategoryCard from './CategoryCard';


interface Category {
  id: number;
  name: string;
  image: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CategorySection = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        // const res = await fetch('http://127.0.0.1:8000/api/tags/'); // local
        const res = await fetch(`${API_URL}/tags/`);
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
      }
    };

    fetchTags();
  }, []);

  return (
    <section className='w-full bg-gray-50 py-12 px-4 md:px-8 lg:px-16'>
      <div className='max-w-7xl mx-auto'>
        {/* Titre section */}
        <h2 className='text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-6'>
          Catégories de Produits
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Découvrez notre large choix de catégories pour trouver rapidement ce dont vous avez besoin.
        </p>

        {/* Grille catégories */}
        <div className='flex flex-wrap justify-center gap-4 lg:gap-6 mt-8 mb-8'>
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              name={category.name} 
              imageUrl={ category.image } />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
