import Footer from "@/components/footer/Footer";
import NavBarcontainer from "@/components/navbar/NavBarcontainer";
import type { Metadata } from "next";
import { Ubuntu } from 'next/font/google';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import Providers from "./providers";


const ubuntu = Ubuntu({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
})
export const metadata: Metadata = {
  // title: "Create Next App",
  title: "Shopin",
  description: "Shopin est une boutique moderne de vente en ligne où vous pouvez acheter et naviguer en toute sécurité.",
};

export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
    <html lang="fr">
      <body className={ubuntu.className}>
        <Providers>
          <>
            <NavBarcontainer />
            <main className="w-full">
            <div className='h-2' />
            {children}
            <div className='h-10' />
            <ToastContainer />
            <Footer />
          </main>
          </>
        </Providers>
      </body>
    </html>
  );
}
