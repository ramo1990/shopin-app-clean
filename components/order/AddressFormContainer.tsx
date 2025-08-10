'use client'

import Modal from '../uiComponents/Modal'
import AddressForm from './AddressForm'
import { useEffect, useState } from 'react'
import { getAddress } from '@/lib/api'
import { AddressType } from '@/lib/types'


const AddressFormContainer = () => {
    // const [email, setEmail] = useState<string | null>(null)
    const [address, setAddress] = useState<AddressType | undefined>(undefined)

    useEffect(() => {
    
        // Appelle getAddress pour récupérer l'adresse
        const fetchAddress = async () => {
        try {
          const result = await getAddress()
          console.log("📦 Adresse récupérée :", result)
          setAddress(result ?? undefined)  // ← Important
        } catch (error) {
          console.error("Erreur de récupération d'adresse:", error)
        }
      }
  
      fetchAddress()
    }, [])

    useEffect(() => {
        const testGetAddress = async () => {
          try {
            const addr = await getAddress();
            console.log("Résultat getAddress:", addr);
            setAddress(addr ?? undefined);
          } catch (e) {
            console.error(e);
          }
        };
        testGetAddress();
      }, []);
    
    console.log("🛠 Adresse passée à AddressForm:", address)
  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <Modal addressForm address={address}>
            <AddressForm address={address ?? undefined} /*email={email}*/ />
        </Modal>
      </div>
    </div>
  )
}

export default AddressFormContainer
