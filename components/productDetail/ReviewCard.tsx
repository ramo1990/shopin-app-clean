// import { PenIcon, Star, TrashIcon } from 'lucide-react'
// import React from 'react'
// import Image from 'next/image'


// interface Review {
//     id: number
//     rating: number
//     comment: string
//     user?: {
//       username: string
//       avatar?: string  // facultatif si tu veux personnaliser les images
//     }
//     created_at?: string  // ou updated_at selon ton modèle
//   }

// const ReviewCard = ({ review }: { review: Review }) => {
//     const starArray = [1, 2, 3, 4, 5]

//   return (
//     <div className='w-full bg-white shadow-md hover:shadow-lg transition-shadow px-6 py-5 rounded-xl flex flex-col gap-5 border border-gray-100'>

//         {/* Actions + Date */}
//         <div className='flex justify-between items-center text-sm text-gray-500'>
//             <div className='flex gap-2'>
//                 <button className='p-2 rounded-md hover:bg-gray-100 transition' aria-label="Supprimer l'avis" >
//                     <TrashIcon className="w-5 h-5 text-gray-600" />
//                 </button>

//                 <button className='p-2 rounded-md hover:bg-gray-100 transition' aria-label="Modifier l'avis">
//                 <PenIcon className="w-5 h-5 text-gray-600" />
//                 </button>
//             </div>

//             <div className="text-end">
//                 <p className="text-xs">Posté</p>
//                 <p className="text-xs">
//                     {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'il y a quelque temps'}
//                 </p>
//             </div>
//         </div>

//          {/* User & Comment */}
//         <div className='flex items-start gap-4'>
//             <div className='w-12 h-12 relative rounded-full overflow-hidden border-2 border-gray-200'>
//                 <Image src={review.user?.avatar || '/default-avatar.png'}
//                      alt='User avatar' className="object-cover rounded-full" fill />
//             </div>

//             <div className='flex-1'>
//                 <p className='text-gray-800 font-semibold text-base'>{review.user?.username || 'Utilisateur'}</p>

//                 <div className='flex gap-1 mt-1'>
//                     {starArray.map((star) => (
//                          <Star key={star}
//                          className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-500 stroke-yellow-500' : 'text-gray-300'}`} /> 
//                     ))}
//                 </div>
//                     <p className='mt-3 text-sm text-gray-700 leading-relaxed'>
//                         {review.comment}
//                     </p>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default ReviewCard
