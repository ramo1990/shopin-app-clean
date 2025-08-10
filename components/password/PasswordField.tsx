import React, { useState } from 'react'


interface Props {
    password: string
    setPassword: (value: string) => void
    placeholder?: string
  }

const PasswordField = ({password, setPassword, placeholder = 'Mot de passe'}: Props) => {
//   const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

//   const togglePasswordVisibility = () => {
//     setShowPassword((prev) => !prev)
//   }

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded"
        placeholder= {placeholder}
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 focus:outline-none"
      >
        {showPassword ? '🙈' : '👁️'}
      </button>
    </div>
  )
}

export default PasswordField
