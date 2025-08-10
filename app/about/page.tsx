"use client"

import React from 'react'

const AboutPage = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">À propos de Shopin</h1>
      <p className="text-gray-700 leading-relaxed text-lg">
        Shopin est une boutique en ligne moderne qui offre une grande variété de produits
        de qualité. Notre mission est de fournir une expérience d&apos;achat agréable, sûre
        et rapide à nos clients. Grâce à une interface intuitive et une assistance client
        dédiée, nous vous accompagnons à chaque étape de votre achat.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Notre Vision</h2>
      <p className="text-gray-700 leading-relaxed">
        Être la référence en matière de commerce électronique dans le monde francophone,
        en combinant technologie, confiance et satisfaction client.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Pourquoi nous choisir ?</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>Livraison rapide et fiable</li>
        <li>Support client réactif</li>
        <li>Produits authentiques et vérifiés</li>
        <li>Retours faciles</li>
      </ul>
    </main>
  )
}

export default AboutPage
