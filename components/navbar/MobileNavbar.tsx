"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { FaBars, FaCartShopping } from "react-icons/fa6"
import { FaTimes } from "react-icons/fa"
import clsx from "clsx"
import { useAuth } from "@/context/AuthContext"
import { useCartContext } from "@/context/CartContext"
import { useRouter } from "next/navigation"


const MobileNavbar = () => {
  const { user: loggedInUser, logout } = useAuth()
  const { cart, clearCart } = useCartContext() // Récupère le panier dynamique
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const toggleMenu = () => setIsOpen(prev => !prev)

  // Calcul du nombre total d'articles dans le panier
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className="relative z-50">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
      >
        {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* Sliding Menu */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 p-5 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Avatar & Name */}
        <div className="flex flex-col items-center gap-2 mb-6 border-b pb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 shadow-sm bg-gray-100">

              <Image
                src={loggedInUser?.image || "/user_default.png"}
                alt={loggedInUser?.name || "Invité"}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
          
          </div>
          <p className="text-lg font-semibold text-gray-800 text-center uppercase tracking-wide">
            {loggedInUser?.name || "Invité"}
          </p>
        </div>

        {/* Links */}
        <ul className="flex flex-col gap-3 text-sm font-medium">
          {loggedInUser ? (
            <>
              <li>
                <Link
                  href="/profile"
                  onClick={toggleMenu}
                  className="block px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                >
                  Profil
                </Link>
              </li>
              <li>
                {/* <Link
                  href="/"
                  onClick={async () => {
                    await logout();
                    toggleMenu;
                    window.location.href = "/";
                  }}
                  className="block px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Logout
                </Link> */}
                <button
                  onClick={async () => {
                    await logout();        // Déconnexion
                    clearCart()
                    toggleMenu();          // Ferme le menu mobile
                    router.push("/");  // Redirection manuelle
                  }}
                  className="block w-full text-left px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/signin"
                onClick={toggleMenu}
                className="block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            </li>
          )}

          {/* Separator */}
          <li className="border-t my-2"></li>

          {/* Cart */}
          <li>
            <Link
              href="/cart"
              onClick={toggleMenu}
              className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-gray-800"
              aria-label="Shopping cart"
            >
              <span>Panier</span>
              <div className="relative w-6 h-6 ml-2 flex items-center justify-center">
                <FaCartShopping className="text-xl" />
                {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center leading-none">
                  {totalItems}
                </span>
                )}
              </div>
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  )
}

export default MobileNavbar
