
import AddressFormContainer from '@/components/order/AddressFormContainer'
import OrderContainer from '@/components/order/OrderContainer'
import { Metadata } from 'next'


// Metadata de page static
export const metadata: Metadata = {
  title: 'Profile - Shopin',
  description: 'Voir les articles dans votre panier',
}

const ProfilePage = () => {
  return (
    <>
    <div className='main-max-width padding-x py-6 flex-center mx-auto'>
      <AddressFormContainer />
    </div>

    <OrderContainer />
    </>
  )
}

export default ProfilePage