import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { AddressType } from '@/lib/types'


interface Props {
    children: React.ReactNode
    addressForm?:boolean
    title?: string
    buttonText?: string
    address : AddressType | undefined
  }

const Modal = ({children, title, buttonText, addressForm, address}: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
      {addressForm ? (
      <button className='address-btn'>{address?.city ? "Modifier Votre adresse de livraison" : "Ajouter une adresse de livraison"}</button>
      ) : (
        <button className='default-btn my-6 text-sm px-6 py-2 max-sm:text-xs max-sm:px-4'>
          {buttonText || "Ouvrir le modal"}
        </button>
        )}
      </DialogTrigger>

      <DialogContent className="px-2">
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold text-gray-800 mb-4'>
            {title ? title : <VisuallyHidden>Dialogue</VisuallyHidden>}
          </DialogTitle>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  )
}

export default Modal
