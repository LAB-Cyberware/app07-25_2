'use client'

import { Providers } from './providers'
import './globals.css';
import { useSession, signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react'

export default function RootLayout({ children }) {
  const { data: session } = useSession();
  return (
    <html lang="es">
      <body>
        <Providers>
          {session && (
            <header>
              <nav className='main-nav'>
                <button 
                  onClick={() => signOut()}
                  className="group fixed top-4 right-4 z-40 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-red-300/50 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  
                  <span className="relative flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Cerrar sesión</span>
                  </span>
                </button>
              </nav>
            </header>
          )}
          {children}
        </Providers>
      </body>
    </html>
  )
}