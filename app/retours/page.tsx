"use client"

import React from 'react'

const ReturnsPage = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Retour & Remboursements</h1>
      
      <p className="text-gray-700 leading-relaxed text-lg mb-6">
        Chez Shopin, votre satisfaction est notre priorité. Si vous n’êtes pas entièrement satisfait de votre achat, vous pouvez demander un retour ou un remboursement selon les conditions ci-dessous.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Conditions de retour</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>Le retour doit être effectué dans un délai de 14 jours après la réception du produit.</li>
        <li>Le produit doit être dans son état d&apos;origine, non utilisé, et dans son emballage d’origine.</li>
        <li>Certains articles, comme les produits personnalisés, ne sont pas éligibles au retour.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Procédure de retour</h2>
      <ol className="list-decimal list-inside text-gray-700 space-y-2">
        <li>Contactez notre service client via la page de contact ou par email.</li>
        <li>Un formulaire de retour vous sera envoyé.</li>
        <li>Envoyez le colis à l’adresse indiquée dans notre réponse.</li>
        <li>Une fois le colis reçu et inspecté, nous vous enverrons un e-mail pour confirmer le traitement du retour.</li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Remboursements</h2>
      <p className="text-gray-700 leading-relaxed">
        Les remboursements sont généralement traités dans un délai de 5 à 10 jours ouvrables après validation du retour. 
        Le montant sera crédité sur le même moyen de paiement utilisé lors de l&apos;achat.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Besoin d&apos;aide ?</h2>
      <p className="text-gray-700">
        Si vous avez des questions ou besoin d&apos;assistance, n&apos;hésitez pas à <a href="/contact" className="text-blue-600 hover:underline">nous contacter</a>.
      </p>
    </main>
  )
}

export default ReturnsPage
