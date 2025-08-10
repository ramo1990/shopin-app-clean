"use client"

import React from 'react'

const PrivacyPage = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>
      
      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
        Chez Shopin, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. Cette politique décrit comment nous recueillons, utilisons et protégeons vos informations.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Informations collectées</h2>
      <p className="text-gray-700">
        Nous collectons les informations suivantes :
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
        <li>Nom, adresse e-mail, numéro de téléphone</li>
        <li>Adresse de livraison et de facturation</li>
        <li>Données de paiement (via des services sécurisés)</li>
        <li>Historique d&apos;achat et de navigation sur notre site</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Utilisation des données</h2>
      <p className="text-gray-700">
        Les données sont utilisées pour :
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
        <li>Traiter vos commandes</li>
        <li>Vous contacter en cas de problème</li>
        <li>Améliorer nos services et personnaliser votre expérience</li>
        <li>Envoyer des newsletters si vous y avez consenti</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Partage des informations</h2>
      <p className="text-gray-700">
        Nous ne vendons pas vos données. Elles peuvent être partagées uniquement avec :
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
        <li>Des prestataires logistiques et de paiement</li>
        <li>Des partenaires techniques pour le bon fonctionnement du site</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Sécurité</h2>
      <p className="text-gray-700">
        Nous utilisons des mesures de sécurité modernes (cryptage SSL, pare-feux, etc.) pour protéger vos données contre tout accès non autorisé.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Vos droits</h2>
      <p className="text-gray-700">
        Vous avez le droit de :
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
        <li>Accéder à vos données</li>
        <li>Demander leur modification ou suppression</li>
        <li>Retirer votre consentement à tout moment</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact</h2>
      <p className="text-gray-700">
        Pour toute question concernant notre politique de confidentialité, vous pouvez nous contacter via la page <a href="/contact" className="text-blue-600 hover:underline">Contact</a>.
      </p>
    </main>
  )
}

export default PrivacyPage
