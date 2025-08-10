// "use client"

// import { Star } from 'lucide-react'
// import React, { useState } from 'react'
// import Button from '../uiComponents/Button'
// import { Textarea } from '../ui/textarea'
// import { cn } from '@/lib/utils'
// import { useAuth } from '@/context/AuthContext'

// interface Props {
//   productId: number;
//   onNewReview?: () => void; // callback optionnel pour recharger les avis
// }

// const ReviewForm = ({ productId, onNewReview }: Props) => {
//   const { token, user } = useAuth()
//   const [hoverRating, setHoverRating] = useState(0)
//   const [hoverReview, setHoverReview] = useState("")
//   const [clickedRating, setClickedRating] = useState(0)
//   const [clickedReview, setClickedReview] = useState("")
//   const [reviewContent, setReviewContent] = useState("")
//   const [loading, setLoading] = useState(false)

//   const ratings = [
//     { rating: 1, review: "Mauvais" },
//     { rating: 2, review: "Passable" },
//     { rating: 3, review: "Bon" },
//     { rating: 4, review: "Très bon" },
//     { rating: 5, review: "Excellent" },
//   ]

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!clickedRating || !reviewContent.trim()) {
//       alert('Veuillez noter et écrire un avis.')
//       return
//     }

//     if (!token) {
//         alert('Vous devez être connecté pour laisser un avis.')
//         return
//       }

//     setLoading(true)

//     try {
//         const res = await fetch(`http://127.0.0.1:8000/api/products/${productId}/reviews/`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             'Authorization': `Bearer ${token}`// à ajouter si JWT requis
//           },
//           body: JSON.stringify({
//             product: productId,
//             rating: clickedRating,
//             comment: reviewContent,
//           }),
//         })
  
//         if (!res.ok) {
//           const errorData = await res.json()
//           console.error("Erreur backend :", errorData)
//           throw new Error("Erreur lors de l’envoi de l’avis.")
//         }
  
//         setClickedRating(0)
//         setClickedReview("")
//         setReviewContent("")
//         alert("Merci pour votre avis !")
  
//         if (onNewReview) onNewReview()
  
//       } catch (err) {
//         if (err instanceof Error) {
//           console.error("Erreur : " + err.message)
//         } else {
//           console.error("Une erreur inconnue s'est produite")
//         }
//       } finally {
//         setLoading(false)
//       }
//   }
  

//   return (
//     <div className='w-full mx-auto bg-white rounded-xl p-6 shadow-lg'>
//       <h3 className='text-lg font-semibold text-gray-800 mb-4 text-center'>
//         Donnez une note et un avis
//       </h3>

//       {/* Étoiles */}
//       <div className='flex items-center justify-center gap-2 mb-2'>
//         {ratings.map(({ rating, review }) => (
//           <Star
//             key={rating}
//             onPointerEnter={() => {
//               setHoverRating(rating)
//               setHoverReview(review)
//             }}
//             onPointerLeave={() => {
//               setHoverRating(0)
//               setHoverReview("")
//             }}
//             onClick={() => {
//               setClickedRating(rating)
//               setClickedReview(review)
//             }}
//             className={cn(
//               'w-7 h-7 cursor-pointer text-gray-400 hover:text-black transition',
//               rating <= hoverRating || rating <= clickedRating ? 'fill-black text-black' : ''
//             )}
//             aria-label={`Étoile ${rating}`}
//           />
//         ))}
//       </div>

//       <p className='text-center text-gray-600 text-sm mb-4'>
//         {hoverReview || clickedReview || "Score de l’avis"}
//       </p>

//       {/* Formulaire */}
//       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
//         <Textarea
//           name="review"
//           className='border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/40 rounded-lg p-3 min-h-[120px]'
//           placeholder="Écrivez votre avis ici"
//           value={reviewContent}
//           onChange={(e) => setReviewContent(e.target.value)}
//           required
//         />

//         <Button
//           type="submit"
//           disabled={loading}
//           className="bg-black text-white w-full py-2 rounded-lg hover:bg-gray-900 transition"
//         >
//           {loading ? "Envoi..." : "Envoyer"}
//         </Button>
//       </form>
//     </div>
//   )
// }

// export default ReviewForm
