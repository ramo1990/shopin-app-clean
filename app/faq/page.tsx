"use client"

import React from 'react'

const FAQPage = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">Foire Aux Questions (FAQ)</h1>

      {/* Question 1 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">🛍️ Comment passer une commande ?</h2>
        <p className="text-gray-700">
          Pour passer une commande, ajoutez les produits souhaités à votre panier, puis cliquez sur &quot;Commander&quot;.
          Vous serez ensuite guidé pour renseigner vos informations de livraison et de paiement.
        </p>
      </div>

      {/* Question 2 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">📦 Quels sont les délais de livraison ?</h2>
        <p className="text-gray-700">
          Les délais de livraison varient entre 2 et 5 jours ouvrables en fonction de votre lieu de résidence
          et du transporteur choisi. Vous recevrez un numéro de suivi après l’expédition.
        </p>
      </div>

      {/* Question 3 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">🔄 Puis-je retourner un article ?</h2>
        <p className="text-gray-700">
          Oui, vous pouvez retourner un article dans un délai de 14 jours après réception, à condition qu’il soit
          dans son état d’origine. Plus d’infos sur notre page <a href="/retours" className="text-blue-600 hover:underline">Retour & Remboursements</a>.
        </p>
      </div>

      {/* Question 4 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">💳 Quels moyens de paiement acceptez-vous ?</h2>
        <p className="text-gray-700">
          Nous acceptons les cartes Visa, Mastercard, PayPal et les virements bancaires. Tous les paiements sont sécurisés.
        </p>
      </div>

      {/* Question 5 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">🔐 Mes informations sont-elles sécurisées ?</h2>
        <p className="text-gray-700">
          Absolument. Toutes vos informations sont cryptées et traitées de manière confidentielle. Consultez notre <a href="/confidentialite" className="text-blue-600 hover:underline">politique de confidentialité</a>.
        </p>
      </div>

      {/* Question 6 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">📩 Comment contacter le service client ?</h2>
        <p className="text-gray-700">
          Vous pouvez nous contacter à tout moment via notre <a href="/contact" className="text-blue-600 hover:underline">formulaire de contact</a>.
        </p>
      </div>
    </main>
  )
}

export default FAQPage
