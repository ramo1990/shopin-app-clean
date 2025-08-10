// "use client"

import React from 'react'
import { Search } from 'lucide-react'
import Form from 'next/form'

const SearchForm = () => {
  return (
    <Form action='/search' scroll={false} className="search-form">
      <input
      /*type='text'*/
        placeholder="Recherche"
        name="query"
        className="flex-1 font-bold w-full outline-none"
        aria-label="Search" required/>

      <button type= "submit" aria-label="Submit search" 
        className=" size-[30px] rounded-full bg-black flex justify-center items-center cursor-pointer ">
            {/* 🔍 */}
        <Search className="size-4" />
      </button>
    </Form>
  )
}

export default SearchForm
