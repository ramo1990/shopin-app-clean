"use client"

import Link from "next/link"

export default function CancelPage() {
  return (
    <section className="max-w-xl mx-auto text-center py-16 px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Paiement annulé</h1>
      <p className="text-lg mb-8">
        Votre paiement a été annulé ou n&apos;a pas pu être traité. 
        Vous pouvez réessayer ou contacter le support si le problème persiste.
      </p>
      <div className="space-x-4">
        <Link 
          href="/cart" 
          className="inline-block px-6 py-3 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
        >
          Retour au panier
        </Link>
        <Link 
          href="/" 
          className="inline-block px-6 py-3 rounded-full bg-gray-800 text-white font-semibold hover:bg-black transition"
        >
          Continuer mes achats
        </Link>
      </div>
    </section>
  )
}
