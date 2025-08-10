"use client"

import { getOrders } from '@/lib/api';
import { OrderType } from '@/lib/types';
import { PackageSearch } from 'lucide-react';
import React, {useEffect, useState} from 'react'
import IndividualOrder from './IndividualOrder';


const OrderContainer = () => {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders()
        setOrders(res)
      } catch (err) {
        console.error("Erreur lors du chargement des commandes :", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return <p>Chargement des commandes...</p>
  }

  console.log('mes commandes', orders)

  if (!orders || orders.length === 0){
  return (
    <div className="w-full py-20 px-6 text-center bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-full shadow">
            <PackageSearch className='w-10 h-10 text-gray-400'/>
          </div>
          <h2 className='text-2xl font-semibold text-gray-700'>Pas de commande pour l’instant</h2>
          <p className='text-gray-500 max-w-md'>Vous n&apos;avez pas encore passé de commande.</p>
        </div>
    </div>
  )
  }

  return (
    <section className='main-max-width mx-auto padding-x py-12'>
      <div className='text-center mb-8'>
        <h2 className="text-3xl font-semibold mb-2">Vos commandes passées</h2>

        <div className="w-full max-h-[500px] overflow-y-auto px-6 py-4 rounded-xl shadow-md space-y-6">
          {orders.map((order: OrderType) => <IndividualOrder key={order.id} order={order} />)}
        </div>
      </div>
    </section>
  )

}

export default OrderContainer