import React from 'react'
import { Progress } from "@/components/ui/progress"


interface Props{
    rating: string
     numRating: number
}

const RatingProgressBar = ({rating, numRating}:Props) => {
    const progressValue = Math.min(numRating *2, 100) // sécurise la valeur max à 100%

  return (
    <div className='flex items-center gap-4 w-full max-sm:gap-2'>
        {/* Nom de la note */}
        <span className='w-[120px] max-sm:w-[80px] truncate text-gray-800 text-sm font-medium'>{rating}</span>

        {/* Barre de progression */}
        <div className='flex-1'>
        <Progress value={progressValue} className='h-2 bg-gray-200 rounded-full'/>
        </div>

        {/* Nombre de votes */}
        <span className='w-[30px] text-right text-sm text-gray-600 font-semibold'>{numRating}</span>

    </div>
  )
}

export default RatingProgressBar
