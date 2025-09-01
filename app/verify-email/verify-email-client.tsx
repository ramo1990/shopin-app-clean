"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Vérification en cours...");
  const [error, setError] = useState<string | null>(null);
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    if (!uid || !token) {
      setError("Lien de vérification invalide.");
      setMessage("");
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`${API_URL}/verify-email/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid, token }),
        });

        const data = await res.json();

        if (res.ok) {
          setMessage(data.message || "Email vérifié avec succès.");
          setError(null);
          setTimeout(() => router.push("/signin?verified=true"), 3000);
        } else {
          const msg = data?.error || "Erreur lors de la vérification.";
          setError(msg);
          setMessage("");
          if (msg.toLowerCase().includes("expiré")) setShowResend(true);
        }
      } catch {
        setError("Erreur réseau ou serveur.");
        setMessage("");
      }
    }

    verify();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow space-y-4 text-center">
        {message && <p className="text-green-600 text-lg">{message}</p>}
        {error && <p className="text-red-600 text-lg">{error}</p>}

        {showResend && (
          <div>
            <p className="text-gray-700 mb-2">Vous pouvez renvoyer un nouveau lien.</p>
            <button
              onClick={() => router.push("/resend-verification")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Renvoyer le lien
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
