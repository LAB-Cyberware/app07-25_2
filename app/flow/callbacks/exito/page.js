'use client'

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Exito() {

    const [updatingUser, setUpdatingUser] = useState(null);
    const [error, setError] = useState(null);
    const { data: session, status } = useSession()
    const router = useRouter()

    const cambiarRol = useCallback(async (nuevoRol) => {

      if (!session?.user?.id) {
        setError('No hay usuario autenticado');
        return;
      }

      try {
        setUpdatingUser(session.user.id);
        
        const response = await fetch(`/api/users/${session.user.id}`, {
          method: 'PATCH', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rol: nuevoRol })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al obtener Premium');
        }

        setError(null);

      } catch (error) {
        console.error('Error:', error);
        setError(error.message || 'Error al cambiar rol');
      } finally {
        setUpdatingUser(null);
      }
      }, [session?.user?.id]);

    useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/')
      return
    }
    if (session && session?.user?.rol !== 'premium') {
      cambiarRol('premium');
    }
    }, [session, status, router, cambiarRol])

        if (error) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-red-900 border border-red-500 rounded-2xl max-w-md w-full p-8 text-white">
                    <h2 className="text-xl font-bold mb-4">Error</h2>
                    <p className="mb-4">{error}</p>
                    <button 
                        onClick={() => setError(null)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        Intentar de nuevo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 border border-purple-500 rounded-2xl max-w-md w-full p-8 text-white relative shadow-2xl shadow-purple-500/20">
                <div className="space-y-5 mb-5">
                    <h2 className="text-xl font-bold text-center">¡FELICIDADES!</h2>
                    <p className="text-center">Has obtenido la membresía Premium.</p>
                    
                    {updatingUser && (
                        <div className="text-center">
                            <p className="text-sm text-purple-300">Activando membresía...</p>
                            <div className="mt-2 flex justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            </div>
                        </div>
                    )}
                </div>
                
                <Link href="/atenea">
                    <button 
                        disabled={updatingUser}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {updatingUser ? 'Procesando...' : 'Regresar a Atenea Digital'}
                    </button>
                </Link>
            </div>
        </div>
    )
}