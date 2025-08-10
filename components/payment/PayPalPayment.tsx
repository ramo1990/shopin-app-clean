// 'use client'

// import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

// export default function PayPalPayment({ amount, orderId }: { amount: number, orderId: number }) {
//   return (
//     <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, currency: 'EUR' }}>
//       <PayPalButtons
//         createOrder={(data, actions) => {
//           return actions.order.create({
//             intent: 'CAPTURE', // ✅ Ajout de l'intent requis
//             purchase_units: [
//               {
//                 amount: {
//                   currency_code: 'EUR',
//                   value: amount.toFixed(2), // Exemple : '49.99'
//                 },
//               },
//             ],
//           });
//         }}
//         onApprove={async (data, actions) => {
//           const details = await actions.order?.capture();
//           console.log('Paiement effectué avec succès !', details);

//           // 👉 Tu peux notifier le backend ici si besoin
//           // await axiosInstance.post(`/orders/${orderId}/pay`, { ... });

//           alert('Paiement validé 🎉');
//         }}
//       />
//     </PayPalScriptProvider>
//   )
// }
