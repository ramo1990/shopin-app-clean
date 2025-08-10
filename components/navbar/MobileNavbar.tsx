"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { FaBars, FaCartShopping } from "react-icons/fa6"
import { FaTimes } from "react-icons/fa"
import clsx from "clsx"
import { useAuth } from "@/context/AuthContext"

// interface Props {
//   loggedInUser: {
//     name: string
//     email: string
//     image: string
//   } | null
// }

const MobileNavbar = () => {
  const { user: loggedInUser } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(prev => !prev)

  return (
    <div className="relative z-50">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        className="p-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* Sliding Menu */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 p-5 transition-transform duration-300 ease-in-out overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Avatar & Name */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-400 shadow-sm bg-gray-200">
            {loggedInUser?.image && (
              <Image
                src={loggedInUser.image}
                alt={loggedInUser.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <p className="text-lg font-semibold text-gray-800 text-center uppercase tracking-wide">
            {loggedInUser?.name || "Invité"}
          </p>
        </div>

        {/* Links */}
        <ul className="flex flex-col gap-4 text-sm font-medium">
          {loggedInUser ? (
            <>
              <li>
                <Link
                  href="/profile"
                  onClick={toggleMenu}
                  className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                >
                  Profil
                </Link>
              </li>
              <li>
                <Link
                  href="/logout"
                  onClick={toggleMenu}
                  className="block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/login"
                onClick={toggleMenu}
                className="block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Login
              </Link>
            </li>
          )}

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
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center leading-none">
                  5
                </span>
              </div>
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  )
}

export default MobileNavbar
