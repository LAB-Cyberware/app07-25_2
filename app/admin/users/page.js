'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';

export default function UsersList() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingUser, setUpdatingUser] = useState(null);
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/')
      return
    }
    if (session.user.rol !== 'admin') {
      router.push('/')
      return
    }
  }, [session, status, router])

  const cambiarRol = async (userId, nuevoRol) => {
    try {
      setUpdatingUser(userId);
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rol: nuevoRol })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar rol');
      }
      
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, rol: nuevoRol }
          : user
      ));

    } catch (error) {
      console.error('Error:', error);
      setError('Error al cambiar rol');
    } finally {
      setUpdatingUser(null);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Estado de carga
  if (loading && session?.user?.rol === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-12 text-center border border-white/20">
          <div className="flex items-center justify-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-blue-500"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Cargando usuarios...</h2>
          <p className="text-slate-600">Por favor espera un momento</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-12 text-center border border-red-200 max-w-md">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={fetchUsers}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                     text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 
                     transform hover:-translate-y-1 hover:shadow-lg active:translate-y-0
                     focus:outline-none focus:ring-4 focus:ring-red-300/50"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Verificación de permisos
  if (!session || session.user.rol !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8 text-center shadow-xl">
          <div className="text-6xl mb-4">🚫</div>
          <div className="text-red-600 text-xl font-semibold">Acceso denegado.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl">👥</span>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Lista de Usuarios
                </h1>
              </div>
              <p className="text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Total de usuarios: <span className="font-semibold text-blue-600">{users.length}</span>
              </p>
            </div>
            
            {/* Botón de refresh */}
            <button
              onClick={fetchUsers}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                       text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 
                       transform hover:-translate-y-1 hover:shadow-lg active:translate-y-0
                       focus:outline-none focus:ring-4 focus:ring-blue-300/50
                       flex items-center gap-2"
            >
              🔄 <span>Actualizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Users Grid */}
        {users.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {users.map((user) => (
              <div 
                key={user._id} 
                className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl 
                         transition-all duration-300 p-6 border border-white/20 
                         hover:-translate-y-2 hover:bg-white/95"
              >
                
                {/* User Header */}
                <div className="flex items-center mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg ${
                    user.rol === 'admin' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                    user.rol === 'premium' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                    'bg-gradient-to-br from-green-500 to-emerald-500'
                  }`}>
                    {user.rol === 'admin' ? '👑' : user.rol === 'premium' ? '⭐' : '👤'}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-bold text-slate-800 truncate">
                      {user.name || 'Sin nombre'}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono truncate">
                      ID: {user._id.slice(-8)}...
                    </p>
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-4 mb-6">
                  {user.email && (
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 rounded-lg p-3">
                      <span className="text-lg">📧</span>
                      <span className="text-sm font-medium truncate">{user.email}</span>
                    </div>
                  )}

                  {user.rol && (
                    <div className="flex items-center justify-center">
                      <span className={`px-4 py-2 text-sm font-semibold rounded-full uppercase tracking-wide border-2 ${
                        user.rol === 'admin' 
                          ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-red-200' 
                          : user.rol === 'premium'
                          ? 'bg-gradient-to-r from-purple-50 to-purple-50 text-purple-700 border-purple-200'
                          : 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200'
                      }`}>
                        {user.rol}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons - Tres botones separados */}
                <div className="space-y-2">
                  {/* Botón User */}
                  {user.rol !== 'user' && (
                    <button 
                      onClick={() => cambiarRol(user._id, 'user')}
                      disabled={updatingUser === user._id}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 
                               text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 
                               transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0
                               focus:outline-none focus:ring-4 focus:ring-green-300/50
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                               flex items-center justify-center gap-2 text-sm"
                    >
                      {updatingUser === user._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <>
                          <span>👤</span>
                          <span>Cambiar a User</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Botón Premium */}
                  {user.rol !== 'premium' && (
                    <button 
                      onClick={() => cambiarRol(user._id, 'premium')}
                      disabled={updatingUser === user._id}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 
                               text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 
                               transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0
                               focus:outline-none focus:ring-4 focus:ring-purple-300/50
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                               flex items-center justify-center gap-2 text-sm"
                    >
                      {updatingUser === user._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <>
                          <span>⭐</span>
                          <span>Cambiar a Premium</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Botón Admin */}
                  {user.rol !== 'admin' && (
                    <button 
                      onClick={() => cambiarRol(user._id, 'admin')}
                      disabled={updatingUser === user._id}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                               text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 
                               transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0
                               focus:outline-none focus:ring-4 focus:ring-red-300/50
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                               flex items-center justify-center gap-2 text-sm"
                    >
                      {updatingUser === user._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <>
                          <span>👑</span>
                          <span>Cambiar a Admin</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          
          /* Empty State */
          <div className="text-center py-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-white/20">
              <div className="text-8xl mb-6 opacity-50">👥</div>
              <h3 className="text-2xl font-bold text-slate-700 mb-4">
                No se encontraron usuarios
              </h3>
              <p className="text-slate-500 mb-6">
                La base de datos no contiene usuarios en este momento.
              </p>
              <button
                onClick={fetchUsers}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                         text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 
                         transform hover:-translate-y-1 hover:shadow-lg active:translate-y-0
                         focus:outline-none focus:ring-4 focus:ring-blue-300/50"
              >
                🔄 Verificar nuevamente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}