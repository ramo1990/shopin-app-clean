'use client'

import React, { useState } from 'react'
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ContactPage = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
        // Ici tu peux envoyer vers ton backend, un email, ou un outil comme Formspree / EmailJS / etc.
        // const res = await fetch('http://127.0.0.1:8000/api/contact/', { // local
        const res = await fetch(`${API_URL}/contact/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })

        if (!res.ok) {
            throw new Error('Erreur lors de l\'envoi.')
          }

      console.log('Message envoyé:', formData)
      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
    }
  }

  return (
    <div className='max-w-3xl mx-auto px-4 py-12'>
      <h1 className='text-3xl font-bold text-center mb-6'>Nous contacter</h1>
      <p className='text-center text-gray-600 mb-10'>
        Une question ? Besoin d&apos;aide ? Laissez-nous un message.
      </p>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
            Nom
          </label>
          <input
            type='text'
            name='name'
            id='name'
            required
            value={formData.name}
            onChange={handleChange}
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-black focus:border-black'
          />
        </div>

        <div>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
            Adresse email
          </label>
          <input
            type='email'
            name='email'
            id='email'
            required
            value={formData.email}
            onChange={handleChange}
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-black focus:border-black'
          />
        </div>

        <div>
          <label htmlFor='message' className='block text-sm font-medium text-gray-700'>
            Message
          </label>
          <textarea
            name='message'
            id='message'
            rows={5}
            required
            value={formData.message}
            onChange={handleChange}
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-black focus:border-black'
          ></textarea>
        </div>

        <button
          type='submit'
          className='bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition'
        >
          Envoyer
        </button>

        {submitted && (
          <p className='text-green-600 font-medium mt-4'>Message envoyé avec succès !</p>
        )}
      </form>
    </div>
  )
}

export default ContactPage
