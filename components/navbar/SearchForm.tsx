// "use client"

import React from 'react'
import { Search } from 'lucide-react'
import Form from 'next/form'

const SearchForm = () => {
  return (
    <Form action='/search' scroll={false} className="flex items-center gap-2 bg-white rounded-full shadow-sm border 
          border-gray-200 px-4 py-2 w-full max-w-md transition-all duration-200 focus-within:border-black focus-within:shadow-md">
      <input
      /*type='text'*/
        placeholder="Recherche"
        name="query"
        className="flex-1 text-gray-700 placeholder-gray-400 font-medium bg-transparent outline-none"
        aria-label="Search" required/>

      <button type= "submit" aria-label="Submit search" 
        className=" w-[30px] h-[30px] rounded-full bg-black text-white flex items-center justify-center hover:bg-blue-950 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
            {/* 🔍 */}
        <Search className="w-4 h-4" />
      </button>
    </Form>
  )
}

export default SearchForm
