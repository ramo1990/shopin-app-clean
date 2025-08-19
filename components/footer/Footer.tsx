"use client"

import React, {useState, useEffect} from 'react'
import { FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa'
import { BsTwitter } from 'react-icons/bs'
import Link from 'next/link'
// import { categories } from '@/lib/categoriesData'


interface Category {
    name: string
    slug: string
  }

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Footer = () => {
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
          try {
            // const res = await fetch('http://127.0.0.1:8000/api/tags/', { cache: 'no-store' }) // local
            const res = await fetch(`${API_URL}/tags/`, { cache: 'no-store' }) // prod
            const data = await res.json()
            console.log("🔎 Catégories récupérées pour le footer:", data)
            setCategories(data)
          } catch (error) {
            console.error("❌ Erreur lors de la récupération des catégories :", error)
          }
        }
    
        fetchCategories()
      }, [])

  return (
    <footer className='bg-black text-white w-full py-16'>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-12 lg:px-20">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* logo  et description */}
            <div>
                <h1> <Link href="/" className='text-3xl font-bold text-white mb-4 pl-2'> Shopin </Link></h1>
                <p className='text-sm text-gray-400 leading-relaxed'>
                    Shopin est une boutique moderne de vente en ligne où vous pouvez acheter
                        et naviguer en toute sécurité.
                </p>
            </div>

            {/* Liens rapides */}
            <div>
                <h2 className='text-lg font-semibold mb-4'> Liens rapides</h2>
                <ul className='text-gray-400 space-y-3 text-sm'>
                    <li> <Link href='/' className='hover:text-white transition'>Accueil</Link></li>
                    
                    {categories.filter((cat) => cat?.slug && cat?.name).map((cat) => (
                        <li key={cat.slug}> 
                            <Link href={`/categories/${cat.slug}`} className='hover:text-white transition'>
                                {cat.name} 
                            </Link>
                        </li>))}

                    <li> <Link href='/contact' className='hover:text-white transition'> Nous contacter </Link></li>
                </ul>
            </div>

            {/* Support client */}
            <div>
                <h2 className='text-lg font-semibold mb-4'>Support client</h2>
                <ul className='text-gray-400 space-y-3 text-sm'>
                    <li> <Link href='/about' className='hover:text-white transition'>À propos de Shopin </Link></li>
                    <li> <Link href='/retours' className='hover:text-white transition'> Retour & Remboursements</Link></li>
                    <li> <Link href="/confidentialite" className='hover:text-white transition'>Confidentialité</Link></li>
                    <li> <Link href="/faq" className='hover:text-white transition'> FAQ</Link></li>
                    <li> <Link href="/order-tracking" className='hover:text-white transition'>Suivi de commande</Link></li>
                    <li> <Link href="/contact" className='hover:text-white transition'>Contact support</Link></li>
                </ul>
            </div>

            {/* Réseaux sociaux */}
            <div className='flex flex-col items-start gap-4'>
                <h2 className="text-lg font-semibold mb-2">Suivez-nous</h2>
                <div className='flex gap-4'>
                    <FaLinkedin className='text-2xl text-gray-400 hover:text-white transition cursor-pointer' />
                    <FaFacebook className='text-2xl text-gray-400 hover:text-white transition cursor-pointer' />
                    <FaInstagram className='text-2xl text-gray-400 hover:text-white transition cursor-pointer' />
                    <BsTwitter className='text-2xl text-gray-400 hover:text-white transition cursor-pointer' />
                </div>
            </div>
        </div>

        {/* Copyright */}
        <div className='border-t border-gray-700 mt-12 pt-6 text-center'>
            <p className='text-sm text-gray-500'>
            © {new Date().getFullYear()} Shopin. Tous droits reservés. </p>
        </div>
        </div>
    </footer>
  )
}

export default Footer
