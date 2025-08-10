// "use client"

import React from 'react'
import { Search } from 'lucide-react'
import Form from 'next/form'

const SearchForm = () => {
  return (
    <Form action='/search' scroll={false} className="flex items-center gap-2 bg-white rounded-full shadow-sm border border-gray-200 px-3 py-1.5 w-full max-w-md focus-within:border-blue-500 transition">
      <input
      /*type='text'*/
        placeholder="Recherche"
        name="query"
        className="flex-1 text-gray-700 placeholder-gray-400 bg-transparent outline-none"
        aria-label="Search" required/>

      <button type= "submit" aria-label="Submit search" 
        className=" w-[30px] h-[30px] rounded-full bg-red-500 hover:bg-red-600 text-white flex justify-center items-center transition ">
            {/* 🔍 */}
        <Search className="w-4 h-4" />
      </button>
    </Form>
  )
}

export default SearchForm
