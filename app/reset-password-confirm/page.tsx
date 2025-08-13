// "use client"

// import { useSearchParams } from 'next/navigation'
// import { useState } from 'react'

// export default function ResetPasswordConfirmPage() {
//   const searchParams = useSearchParams()
//   const uid = searchParams.get("uid")
//   const token = searchParams.get("token")
//   const [password, setPassword] = useState("")
//   const [success, setSuccess] = useState(false)
//   const [error, setError] = useState("")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password-confirm/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ uid, token, new_password: password })
//     })

//     const data = await res.json()
//     if (res.ok) {
//       setSuccess(true)
//     } else {
//       setError(data.error || "Erreur lors du changement de mot de passe.")
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
//         <h2 className="text-xl font-semibold">Réinitialiser le mot de passe</h2>

//         {success ? (
//           <p className="text-green-600">
//             Mot de passe modifié avec succès. <a href="/signin" className="underline">Connecte-toi ici</a>
//           </p>
//         ) : (
//           <>
//             <input
//               type="password"
//               placeholder="Nouveau mot de passe"
//               className="border px-4 py-2 w-full"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             {error && <p className="text-red-600">{error}</p>}
//             <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Valider</button>
//           </>
//         )}
//       </form>
//     </div>
//   )
// }
