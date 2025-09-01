import { Suspense } from "react";
import SignInClient from "./SignInClient";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Chargement...</div>}>
      <SignInClient />
    </Suspense>
  );
}