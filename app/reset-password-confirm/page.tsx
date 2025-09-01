import { Suspense } from "react";
import ResetPasswordConfirmClient from "./ResetPasswordConfirmClient";

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Chargement...</div>}>
      <ResetPasswordConfirmClient />
    </Suspense>
  )
}
