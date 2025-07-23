'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Login() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session && session.user.rol === 'admin') {
      router.push('/admin')
    }
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent"></div>
            <p className="text-gray-600 font-medium animate-pulse">Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (session) {
    if (session.user.rol === 'admin') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-600 to-purple-800 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 hover:scale-105">
            <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
              Cargando...
            </h1>
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-red-600 border-t-transparent"></div>
              <p className="text-gray-600 font-medium animate-pulse">Cargando sesión de Administrador...</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
          <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            ¡Bienvenido!
          </h1>
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200/50 hover:shadow-lg transition-all duration-200">
            <div className="space-y-3">
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">Nombre:</span> 
                <span className="ml-2">{session.user.name}</span>
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">Email:</span> 
                <span className="ml-2">{session.user.email}</span>
              </p>
              <p className="text-gray-700 flex items-center">
                <span className="font-semibold text-gray-900">Rol:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
                  session.user.rol === 'admin' ? 
                    'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200 hover:from-red-200 hover:to-pink-200' :
                  session.user.rol === 'mod' ? 
                    'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200 hover:from-yellow-200 hover:to-orange-200' :
                    'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 hover:from-green-200 hover:to-emerald-200'
                }`}>
                  {session.user.rol}
                </span>
              </p>
            </div>
          </div>
          
          {/* Contenedor flex para los botones en la misma fila */}
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

            <button
              onClick={() => signOut()}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                       text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 
                       transform hover:scale-105 hover:shadow-lg active:scale-95
                       focus:outline-none focus:ring-4 focus:ring-red-300/50"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>🚪</span>
                <span className="text-sm">Cerrar sesión</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Iniciar sesión
        </h1>
        
        <button
          onClick={() => signIn('google')}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                   text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 
                   transform hover:scale-105 hover:shadow-lg active:scale-95
                   focus:outline-none focus:ring-4 focus:ring-blue-300/50
                   relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                         transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
          <span className="relative flex items-center justify-center space-x-3">
            <span className="text-xl">🔐</span>
            <span className="tracking-wide">Iniciar sesión con Google</span>
          </span>
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Utiliza tu cuenta de Google para acceder
          </p>
        </div>
      </div>
    </div>
  )
}