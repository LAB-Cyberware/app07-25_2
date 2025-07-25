'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation' 
import { useEffect } from 'react'

export default function Login() {  
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => { 
    if (session && session.user.rol === 'user') { 
      router.push('/atenea')
    }else{
      if (session && session.user.rol === 'admin') { 
        router.push('/admin')
      }
    }
  }, [session, router])

  if (status === 'loading') return <p>Cargando...</p>

  
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
            Cargando sesión...
          </h1>
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