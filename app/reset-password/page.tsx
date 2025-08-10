import React, { Suspense } from 'react'
import ResetPasswordClient from './ResetPasswordClient'

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ResetPasswordClient />
    </Suspense>
  )
}

export default ResetPasswordPage
