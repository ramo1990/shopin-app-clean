"use client"

import Link from "next/link"
import { useState } from 'react'
import MobileNavbar from './MobileNavbar'
import NavItems from './NavItems'
import SearchButton from './SearchButton'
import SearchForm from './SearchForm'


const NavBar = () => {
    const [showSearchForm, setShowSearchForm] = useState(false)
    // const { cart } = useCartContext() // récupère le panier

    const handleSearch = () => setShowSearchForm(prev => !prev)

  return (
    <>
    <nav className='bg-[whitesmoke] sticky top-0 z-20 w-full py-3 border-b border-gray-300 shadow-sm'>
        <div className='w-full max-w-7xl mx-auto flex justify-between items-center padding-x px-4 md:px-6 lg:px-8'>

        {/* Logo */}
        <Link href="/">
            <h1 className='text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'> 
            Shopin </h1>
        </Link>
        
        {/* Desktop Search */}
        <div className='hidden lg:flex justify-center flex-1 mx-4'>
            <div className='mx-auto max-w-md'>
                <SearchForm />
            </div>
        </div>

        {/* Mobile Search Button */}
        <div className='block lg:hidden'>
        <SearchButton handleSearch={handleSearch} showSearchForm={showSearchForm} aria-label="Rechercher" />
        </div>
        
        {/* Mobile Navbar (hamburger) */}
        <div className='block md:hidden'>
            <MobileNavbar />
        </div>

        {/* Desktop NavItems */}
        <div className='hidden md:flex items-center gap-4'>
            <NavItems /> 
        </div>

        </div>
    </nav>

    {/* Mobile Search Form */}
    { showSearchForm && (
        <div className='block md:block lg:hidden mt-2 px-4'>
            <div className='flex justify-center'>
                <div className='w-full max-w-md'>
                    <SearchForm />
                </div>
            </div>
        </div>
    )}
    </>
  )
}


export default NavBar
