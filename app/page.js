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
    }
    if (session && session.user.rol === 'admin') { 
      router.push('/admin')
    }
  }, [session, router])

  if (status === 'loading') return <p>Cargando...</p>

  
  if (session) { 
    if (session.user.rol === 'admin') {
      return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md"> 
          <h1 className="text-2xl font-bold mb-4">Cargando...</h1> 
          <p>Cargando sesión de Administrador...</p>
        </div> 
      )
    }
  }

  return ( 
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
      <button
        onClick={() => signIn('google')}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Iniciar sesión con Google
      </button>
    </div>
  )
}