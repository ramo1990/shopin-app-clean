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
        className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center 
                  cursor-pointer transition-all duration-200 hover:bg-gray-900 hover:scale-105 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
        {showSearchForm ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
    </button>
  )
}

export default SearchButton
