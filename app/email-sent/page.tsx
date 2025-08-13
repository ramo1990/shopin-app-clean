export default function EmailSentPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded shadow-md max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">📩 Vérification en attente</h1>
          <p className="text-gray-700">
            Un lien de vérification vous a été envoyé par email. Cliquez sur ce lien pour activer votre compte.
          </p>
          <p className="text-sm text-gray-500 mt-4">N'oubliez pas de vérifier votre dossier spam.</p>
        </div>
      </div>
    )
  }
  