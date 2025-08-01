'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function PremiumPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/')
      return
    }
    if (session.user.rol !== 'premium' && session.user.rol !== 'admin') {
      router.push('/')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-6 w-6 border-3 border-slate-300 border-t-blue-500"></div>
          <span className="text-slate-600 font-medium text-lg">Cargando...</span>
        </div>
      </div>
    )
  }

  if (!session || session.user.rol !== 'premium' && session.user.rol !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8 text-center shadow-xl">
          <div className="text-6xl mb-4">🚫</div>
          <div className="text-red-600 text-xl font-semibold">Acceso denegado.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto mt-8">
        {/* Contenedor principal con efecto glassmorphism */}
        <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 overflow-hidden">
          
          {/* Línea superior decorativa */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"></div>
          
          {/* Título con corona */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl opacity-80">⭐</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Página de Usuario Premium
            </h1>
          </div>
          
          {/* Mensaje de bienvenida */}
          <p className="text-lg text-slate-600 font-medium mb-6">
            ¡Bienvenido, <span className="text-blue-600 font-semibold">{session.user.name}</span>!
          </p>
          
          {/* Tarjeta de información con gradiente */}
          <div className="relative bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 mb-8 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            
            {/* Barra lateral izquierda */}
            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-red-500 to-red-400"></div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-800 font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-xl">📧</span>
                <span>Email: {session.user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-red-800 font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-xl">🎯</span>
                <span>Rol actual: {session.user.rol}</span>
              </div>
            </div>
          </div>
          
        <div className="flex gap-3">
            <Link href="/atenea" className="flex-1">
              <button
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 
                          hover:to-green-700 
                          text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 
                          transform hover:scale-105 hover:shadow-lg active:scale-95
                          focus:outline-none focus:ring-4 focus:ring-green-300/50"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🧠</span>
                  <span className="text-sm">AteneaDigitalMVP</span>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}