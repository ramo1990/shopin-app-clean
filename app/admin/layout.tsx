'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    {href: '/admin', label:'Dashboard' },
    { href: '/admin/products', label: 'Produits' },
    { href: '/admin/users', label: 'Utilisateurs' },
    { href: '/admin/orders', label: 'Commandes' },
    { href: '/admin/tags', label: 'Categories' },
    // Ajoute d'autres sections ici
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-gradient-to-b from-gray-100 to-gray-200 border-r p-6">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">Admin</h1>
        <nav className="space-y-2">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'block px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors',
                pathname.startsWith(href) ? 'bg-indigo-600 font-semibold shadow' : 
                'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-white">
        {children}
      </main>
    </div>
  )
}
