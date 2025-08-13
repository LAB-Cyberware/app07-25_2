import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'  
  
const [updatingUser, setUpdatingUser] = useState(null);
const { data: session, status } = useSession()
const router = useRouter()

useEffect(() => {
  if (status === 'loading') return
  if (!session) {
    router.push('/')
    return
  }
  if (session && session?.user?.rol !== 'premium') {
    cambiarRol();
  }
}, [session, status, router])

const cambiarRol = async (nuevoRol) => {
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
    
    const updatedUser = await response.json();
    alert('¡Ahora eres Premium!');
    setShowPayModal(false);
    setShowPricingModal(false);

  } catch (error) {
    console.error('Error:', error);
    setError(error.message || 'Error al cambiar rol');
  } finally {
    setUpdatingUser(null);
  }
};

const Payment = () => {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
        <div className="bg-gradient-to-br from-purple-900 to-blue-900 border border-purple-500 rounded-2xl max-w-md w-full p-8 text-white relative shadow-2xl shadow-purple-500/20">
          <button onClick={() => setShowPayment(false)} className="absolute top-2 right-4 text-white/70 hover:text-white">
              <X />
          </button>
          <h2 className='space-y-5 mb-5'>¡FELICIDADES! Has obtenido la membresía Premium.</h2>
          <button onClick={() => setShowPayment(false)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
              Salir
          </button>
        </div>
      </div>
    )
}