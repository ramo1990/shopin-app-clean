import React from 'react'
import { Search, X } from 'lucide-react'

interface Props{
    handleSearch:() => void;
    showSearchForm: boolean;
}

const SearchButton = ({handleSearch, showSearchForm}: Props) => {
  return (
    <button 
        onClick={handleSearch} 
        aria-label={showSearchForm ? "Fermer la recherche" : "Ouvrir la recherche"}
        // className="size-[30px] rounded-full bg-black flex justify-center items-center cursor-pointer text-white"
        className="w-[30px] h-[30px] rounded-full bg-black text-white flex items-center justify-center cursor-pointer 
        transition hover:opacity-90">
        {showSearchForm ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
    </button>
  )
}

export default SearchButton
