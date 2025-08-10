"use client"  // Ce composant doit s'exécuter côté client (pour utiliser hooks React)

/* Ce code:
  Affiche les éléments de navigation (connexion, déconnexion, panier, profil).
  Change son affichage selon que l’utilisateur est connecté ou non.
  Utilise useAuth pour l’authentification, useCartContext pour le panier.
  Adapte la mise en page pour mobile avec la prop mobile.
*/
import React from 'react'
import Link from 'next/link'  // Pour créer des liens internes avec Next.js
import { FaCartShopping } from 'react-icons/fa6'  // Icône de panier
import { cn } from "@/lib/utils"  // Fonction utilitaire pour gérer les classes conditionnelles
import Image from "next/image"
import { useCartContext } from '@/context/CartContext' // Contexte du panier
// import { useWishlist } from '@/context/WishlistContext'
import { useAuth } from "@/context/AuthContext"  // Contexte d'authentification
import { useRouter } from 'next/navigation'


// Définition des props que ce composant accepte
interface Props {
  mobile?: boolean;  // Affichage mobile ou desktop
  onLinkClick?: () => void;  // Callback appelé lors d’un clic sur un lien
  // loggedInUser: {
  //   first_name: string;
  //   email: string;
  //   image: string;
  // } | null;
}

const NavItems = ({ mobile = false, onLinkClick }: Props) => {
  const router = useRouter()
  // Fonction appelée quand un lien est cliqué (ex: pour fermer le menu mobile)
  const handleClick = () => {
    if (onLinkClick) onLinkClick()
  };

  const { cart, clearCart } = useCartContext()  // Accès au panier et à la fonction pour le vider
  // const { wishlist } = useWishlist()
  const {user, logout, loading } = useAuth()  // Infos utilisateur et méthodes d’auth

  const handleLogout = async () => {
    await logout()  // attend la déconnexion 
    clearCart()  // Vider le panier à la déconnexion
    router.push("/") // ou /signin
  }

  if (loading) return null // Pendant le chargement du contexte Auth, on n’affiche rien

  const firstName = user?.first_name || 'Utilisateur'; // Prénom par défaut

  return (
    <div className={cn("flex items-center gap-3", mobile ? "flex-col" : "flex-row")}>
      {user ? (
        // Si l’utilisateur est connecté
        <>
          {/* Image de profil (ou image par défaut) */}
          <div className="w-10 h-10 rounded-full overflow-hidden border-[2px] border-gray-400 shadow-sm bg-gray-100">
            <Image
              src={user?.image || "/casquette.jpeg"} // prends l'image utilisateur ou une valeur par défaut
              alt={`Photo de ${user?.first_name}`}
              className="w-full h-full object-cover"
              width={40}
              height={40}
            />
          </div>

          {/* Lien vers le profil utilisateur */}
          <Link
            href="/profile"
            className="text-base font-semibold text-gray-900 hover:text-gray-600 transition-colors duration-200"
            onClick={handleClick}
          >
            Bonjour, {firstName}
          </Link>

          {/* Bouton de déconnexion */}
          <button
            title="Se déconnecter"
            onClick={handleLogout}
            className="px-4 py-1 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </>
      ) : (
        // Si l’utilisateur n’est pas connecté, lien vers la page de connexion
        <Link
          href="/signin"
          className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition duration-200"
          onClick={handleClick}
        >
          Login
        </Link>
      )}

      {/* Lien vers la page Panier avec badge si le panier contient des articles */}
      <Link href="/cart" className="relative flex items-center justify-center w-[40px] h-[40px] cursor-pointer" aria-label="Shopping cart">
        <FaCartShopping className="cart-icon text-2xl text-black" />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 text-[10px] bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center leading-none shadow-sm">
            {cart.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </Link>

      {/* Wishlist */}
      {/* <Link
        href="/wishlist"
        className="relative text-sm font-medium text-gray-700 hover:text-black transition"
      >
        Wishlist
        {wishlist.length > 0 && (
          <span className="absolute -top-2 -right-2 text-[10px] bg-pink-600 text-white rounded-full w-5 h-5 flex items-center justify-center leading-none text-xs shadow-sm ml-1">
            {wishlist.length}
          </span>
        )}
      </Link> */}
    </div>
  )
}

export default NavItems
