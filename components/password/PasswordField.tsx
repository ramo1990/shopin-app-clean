import React, { useState } from 'react'
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/24/outline"

interface Props {
    password: string
    setPassword: (value: string) => void
    placeholder?: string
  }

const PasswordField = ({password, setPassword, placeholder = 'Mot de passe'}: Props) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full h-12 px-4 pr-10 border border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-2 focus:ring-black/20 transition duration-200"
        placeholder= {placeholder}
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition"
      >
        {showPassword ? (
          <EyeSlashIcon className="w-5 h-5" />)  : (<EyeIcon className="w-5 h-5" />)}
      </button>
    </div>
  )
}

export default PasswordField
