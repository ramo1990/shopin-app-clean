"use client"

import React, { useState, useEffect} from 'react'
import { Input } from '../ui/input'
import { addAddress } from '@/lib/api'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AddressType } from '@/lib/types'


const AddressForm = ({address}: { address: AddressType | undefined}) => {
    // const [fullName, setFullName] = useState(address?.full_name ? address.full_name : '')
    // const [addressField, setAdressField] = useState(address?.address ? address.address : '')
    // const [city, setCity] = useState(address?.city ? address.city : '')
    // const [postalCode, setPostalCode] = useState(address?.postal_code ? address.postal_code : '')
    // const [country, setCountry] = useState(address?.country ? address.country : '')
    // const [phone, setPhone] = useState(address?.phone ? address.phone : '')
    // const [btnLoader, setBtnLoader] = useState(false)
    const [fullName, setFullName] = useState('')
    const [addressField, setAdressField] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [country, setCountry] = useState('')
    const [phone, setPhone] = useState('')
    const [btnLoader, setBtnLoader] = useState(false)

    // Met à jour les champs si `address` est défini
    useEffect(() => {
        console.log('Adresse reçue dans useEffect:', address)
        if (address) {
          setFullName(address.full_name || '')
          setAdressField(address.address || '')
          setCity(address.city || '')
          setPostalCode(address.postal_code || '')
          setCountry(address.country || '')
          setPhone(address.phone || '')
        }
      }, [address])

    
    function disableButton() {
        return [fullName, addressField, city, postalCode, country, phone].some(field => field.trim().length === 0)
    }

    async function handleAddAddress(e: React.FormEvent<HTMLElement>) {
        e.preventDefault()
        setBtnLoader(true)

        const addressObj = {full_name: fullName, address: addressField, city, postal_code: postalCode, country, phone}

        try{
            await addAddress(addressObj);
            toast.success('Adresse enregistrée')
            // Reset form
            // setFullName("")
            // setAdressField("")
            // setCity("")
            // setPostalCode("")
            // setCountry("")
            // setPhone("")
        } 
        catch (err: unknown) {
            if (err instanceof Error) {
                // Si l'erreur vient du backend disant que l'adresse existe déjà
                if (err.message.includes('existe déjà')) {
                    toast.info("Cette adresse a déjà été enregistrée.")
                } else {
                    toast.error(err.message)
                }
                return;
            }
            toast.error('Une erreur inconnue est  survenue')
            throw new Error('Une erreur inconnue est  survenue')
        }
        finally{
            setBtnLoader(false)
        }
    }

  return (
    <form onSubmit={handleAddAddress} className='w-full mx-auto bg-white p-8 rounded-2xl space-y-6'>
      <h2 className='text-2xl font-semibold text-gray-800 text-center mb-6'>Adresse de livraison</h2>

      <div className='space-y-4'>
        <Input placeholder='Nom complet' 
            value={fullName}
            readOnly // rendre le champ en lecture seule
            // onFocus={() => toast.info("Impossible de modifier votre nom")}
            style={{ pointerEvents: 'none' }}
            onChange={(e) => setFullName(e.target.value)}
            className='w-full h-12 px-4 rounded-md border-gray-300 focus:border-black focus:ring-black/20 transition-all'/>

        <Input placeholder='Adresse complète' 
            value={addressField}
            onChange={(e) => setAdressField(e.target.value)}
            className='w-full h-12 px-4 rounded-md border-gray-300 focus:border-black focus:ring-black/20 transition-all' />
            
        <Input placeholder='Ville'
            value={city}
            onChange={(e) => setCity(e.target.value)} 
            className='w-full h-12 px-4 rounded-md border-gray-300 focus:border-black focus:ring-black/20 transition-all' />

        <Input placeholder='Code postal' 
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className='w-full h-12 px-4 rounded-md border-gray-300 focus:border-black focus:ring-black/20 transition-all' />
        
        <Input placeholder='Pays' 
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className='w-full h-12 px-4 rounded-md border-gray-300 focus:border-black focus:ring-black/20 transition-all' />

        <Input placeholder='Téléphone' 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className='w-full h-12 px-4 rounded-md border-gray-300 focus:border-black focus:ring-black/20 transition-all' />
      </div>

      <button type="submit" disabled={disableButton() || btnLoader} 
        className='w-full h-12 bg-black text-white cursor-pointer font-medium rounded-md hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'>
        {btnLoader ? "Enregistrement en cours ..." : address?.city ? "Modifier adresse" : "Enregistrer"}
      </button>
    </form>
  )
}

export default AddressForm
