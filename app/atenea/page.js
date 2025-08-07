'use client'

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Send, Copy, Shield, Brain, Lock, Star, CheckCircle, ArrowRight, X, LogOut } from 'lucide-react';
import { isAssetError } from 'next/dist/client/route-loader';
import GooglePayButton from '@google-pay/button-react';

// --- Mock Data ---
const MOCK_TESTIMONIALS = [
  { name: 'InfluencerAlpha', handle: '@alpha_creates', text: 'Atenea Digital cambió el juego. Ahora manejo los comentarios negativos con humor y hasta mis seguidores lo disfrutan.' },
  { name: 'TechGuru', handle: '@techreviews', text: 'La inteligencia detrás de las respuestas es brutal. Ahorro tiempo y energía mental. ¡100% recomendada!' },
  { name: 'ArtistaVisual', handle: '@visualdreams', text: 'Como artista, mi trabajo es muy personal. Atenea me da un escudo para proteger mi creatividad. Es esencial.' },
];

const MOCK_STATS = {
  responsesGenerated: '125,843',
  mentalPeaceRestored: '98%',
  audienceEngagementUp: '45%',
};

const FREE_STRATEGIES = ['Sarcasmo Elegante', 'Análisis Pseudo-Psicológico'];
const MAX_FREE_USES = 5;

// --- Main App Component ---
const AteneaDigitalMVP = () => {
  const [comment, setComment] = useState('');
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey] = useState('AIzaSyAxrO75Dy9QxibfFsamlZYxKIcqFUNrt8w');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [usageCount, setUsageCount] = useState(0);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showPayMethod, setShowPayMethod] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState('10000.00');
  const [showSuccesfulPay, setShowSuccesfulPay] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [showWaitlistSuccess, setShowWaitlistSuccess] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(null);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/')
      return
    }
  }, [session, status, router])

  // --- Demo Mode on Load ---
  useEffect(()=> {
    if (session?.user) {
    setComment('Otra vez tú... ¿No te cansas de buscar atención?');
    setResponses([
      { strategy: 'Sarcasmo Elegante', text: 'Vaya, mi fan número uno. Agradezco tu dedicación inquebrantable para consumir todo mi contenido. Tu apoyo es... notado.', isLocked: false },
      { strategy: 'Análisis Pseudo-Psicológico', text: 'Interesante. Tu comentario es, en sí mismo, una forma de buscar atención en mi publicación. ¿No es fascinante cómo funciona la psique humana? Gracias por esta valiosa lección práctica de proyección.', isLocked: false },
      { strategy: 'Deconstrucción Intelectual', text: 'Has usado una palabra para expresar una emoción compleja. Si bien es un enfoque minimalista, carece de datos. ¿Podrías desarrollar tu tesis? Espero tu ensayo.', 
        isLocked: session?.user?.rol !== 'premium' },
      { strategy: 'Confusión Absurda', text: '¡Gracias por el recordatorio! Justo ahora estaba procrastinando en mi trabajo de "ignorar consejos no solicitados". Tu comentario me ha ayudado a volver a mi tarea principal.', 
        isLocked: session?.user?.rol !== 'premium' },
    ]);
  }
  }, [session]);

  // --- Core Logic ---
  const generateResponses = async () => {
    if (usageCount >= MAX_FREE_USES && session?.user?.rol !== 'premium') {
      setShowPricingModal(true);
      return;
    }
    setIsLoading(true);
    setResponses([]);

    const listaEstrategias = {
        sarcasmo: { 
          name: 'Sarcasmo Elegante',
          description: 'Ironía fina que expone la ridiculez.'
        },
        psicologico: {
          name: 'Análisis Pseudo-Psicológico',
          description: 'Falsa compasión que trata al hater como un paciente.'
        },
        intelectual: {
          name: 'Deconstrucción Intelectual',
          description: 'Desmontar el comentario como si fuera una pieza de lógica fallida.'
        },
        confusión: {
          name: 'Confusión Absurda',
          description: 'Una respuesta tan inesperada que rompe la lógica del ataque.'
      }
    }

    let estrategias;
    if (session?.user?.rol === 'premium') {
      estrategias = listaEstrategias;
      } else {
        estrategias = { 
          sarcasmo: listaEstrategias.sarcasmo,
          psicologico: listaEstrategias.psicologico
        }
      }
    
    const prompt = `### ROL Y OBJETIVO ###
Eres un Agente IA especializado llamado "Atenea Digital". Tu personalidad es una fusión de un psicólogo experto, un maestro de la retórica y un comediante ingenioso. Tu misión es analizar comentarios de "haters" y generar 4 respuestas ingeniosas, cada una con una estrategia diferente, para desarmar la agresión y proteger la paz mental del creador.

### PRINCIPIOS FUNDAMENTALES ###
* NUNCA DEFIENDAS EL CONTENIDO.
* EL FOCO ES EL ACTO DE ODIAR, no el contenido.
* USA SARCASMO, IRONÍA Y LÓGICA para un desarme intelectual.
* GANA A LA AUDIENCIA, no al hater.
* PROHIBIDO EL ATAQUE BÁSICO o insultos.

### ESTRATEGIAS REQUERIDAS ###
Genera exactamente una respuesta para cada una de las siguientes estrategias:
"${estrategias}"

### TAREA ###
Analiza el siguiente comentario de un hater y genera 4 respuestas, una por cada estrategia listada.
Input (Comentario del Hater): "${comment}"

### FORMATO DE SALIDA ###
Usa este formato exacto, separando cada respuesta con '---':
Estrategia: Sarcasmo Elegante
Respuesta: [Tu respuesta aquí]
---
Estrategia: Análisis Pseudo-Psicológico
Respuesta: [Tu respuesta aquí]
---
Estrategia: Deconstrucción Intelectual
Respuesta: [Tu respuesta aquí]
---
Estrategia: Confusión Absurda
Respuesta: [Tu respuesta aquí]`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      
      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      const parsedResponses = parseAndClassifyResponses(generatedText);
      setResponses(parsedResponses);
      setUsageCount(prev => prev + 1);

    } catch (error) {
      console.error('Error al generar respuestas:', error);
      alert('Error al generar respuestas. Verifica tu API Key y la conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseAndClassifyResponses = (text) => {
    const sections = text.split('---').map(s => s.trim());
    return sections.map(section => {
      const strategyMatch = section.match(/Estrategia: (.*)/);
      const responseMatch = section.match(/Respuesta: (.*)/);
      
      if (strategyMatch && responseMatch) {
        const strategy = strategyMatch[1].trim();
        const responseText = responseMatch[1].trim();
        const isLocked = session?.user?.rol !== 'premium' && !FREE_STRATEGIES.includes(strategy);
        return { strategy, text: responseText, isLocked };
      }
      return null;
    }).filter(Boolean);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (waitlistEmail) {
      console.log('Waitlist email captured:', waitlistEmail);
      setShowWaitlistSuccess(true);
      setTimeout(() => {
        setShowWaitlistSuccess(false);
        setWaitlistEmail('');
      }, 3000);
    }
  };

  const getStrategyIcon = (strategy) => {
    if (strategy.toLowerCase().includes('sarcasmo')) return '😏';
    if (strategy.toLowerCase().includes('psicológico')) return '🧠';
    if (strategy.toLowerCase().includes('confusión')) return '🤔';
    if (strategy.toLowerCase().includes('intelectual')) return '🎓';
    return '✨';
  };

  // --- Sub-Components ---
  const PricingModal = () => {
    const [selectedPlan, setSelectedPlan] = useState('monthly');

    const plans = [
      { id: 'weekly', name: 'Plan Semanal', price: '5000.00', period: '/ semana' },
      { id: 'monthly', name: 'Plan Mensual', price: '10000.00', period: '/ mes' },
      { id: 'yearly', name: 'Plan Anual', price: '80000.00', period: '/ año' }
    ];

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-purple-900 to-blue-900 border border-purple-500 rounded-2xl max-w-md w-full p-8 text-white relative shadow-2xl shadow-purple-500/20">
          <button onClick={() => setShowPricingModal(false)} className="absolute top-2 right-4 text-white/70 hover:text-white">
            <X />
          </button>
          <div className="text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-1" />
            <h2 className="text-2xl font-bold mb-1">Desbloquea todo el Potencial</h2>
            <div className="bg-white/10 p-2 rounded-lg mb-2 text-left">
              <ul className="space-y-1">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-400" /> Respuestas Ilimitadas</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-400" /> Acceso a TODAS las estrategias</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-400" /> Análisis de tono avanzado</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-400" /> Soporte prioritario</li>
              </ul>
            </div>
            
            {/* Plan Selection */}
            <div className="space-y-2 mb-2">
              {plans.map((plan) => (
                <label key={plan.id} className="block cursor-pointer">
                  <div className={`relative border-2 rounded-lg p-4 transition-all ${
                    selectedPlan === plan.id 
                      ? 'border-purple-400 bg-white/10' 
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}>
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={selectedPlan === plan.id}
                      onChange={(e) => {
                        setSelectedPlan(e.target.value)
                        setSelectedPrice(plan.price)}
                      }
                      className="absolute opacity-0"
                    />
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="font-semibold text-white">{plan.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">{plan.price} <span className="text-sm font-normal text-purple-300">{plan.period}</span></p>
                      </div>
                    </div>
                    {selectedPlan === plan.id && (
                      <div className="absolute top-2 right-2">
                        <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <button onClick={() => setShowPayModal(true)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
              Actualizar a Premium
            </button>
            {showPayModal && <PayModal />}
          </div>
        </div>
      </div>
    );
  };

  const PayModal = () => {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
        <div className="bg-gradient-to-br from-purple-900 to-blue-900 border border-purple-500 rounded-2xl max-w-md w-full p-8 text-white relative shadow-2xl shadow-purple-500/20">
          <button onClick={() => setShowPayModal(false)} className="absolute top-2 right-4 text-white/70 hover:text-white">
                <X />
          </button>
          <h2 className='space-y-5 mb-5'>¿Quieres comprar y actualizar a Premium?</h2>
          <span className='flex gap-8'>
            {session?.user?.rol !== 'premium' && (
              <button  
              onClick={() => setShowPayMethod(true)} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Actualizar y Pagar
              </button>
            )}
            <button onClick={() => setShowPayModal(false)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                Cancelar
            </button>
            {showPayMethod && <PayMethod />}
          </span>
        </div>
      </div>
    )
  }

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

  const PayMethod = () => {
     return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
        <div className="bg-gradient-to-br from-purple-900 to-blue-900 border border-purple-500 rounded-2xl max-w-md w-full p-8 text-white relative shadow-2xl shadow-purple-500/20">
          <button onClick={() => setShowPayMethod(false)} className="absolute top-2 right-4 text-white/70 hover:text-white">
                <X />
          </button>
          <GooglePayButton
            environment="TEST"
            paymentRequest={{
              apiVersion: 2,
              apiVersionMinor: 0,
              allowedPaymentMethods: [
                {
                  type: 'CARD',
                  parameters: {
                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                    allowedCardNetworks: ['MASTERCARD', 'VISA'],
                  },
                  tokenizationSpecification: {
                    type: 'PAYMENT_GATEWAY',
                    parameters: {
                      gateway: 'example',
                      gatewayMerchantId: 'exampleGatewayMerchantId',
                    },
                  },
                },
              ],
              merchantInfo: {
                merchantId: '5630822997',
                merchantName: 'Epic Media Wave',
              },
              transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPriceLabel: 'Total',
                totalPrice: ''+selectedPrice+'',
                currencyCode: 'CLP',
                countryCode: 'CL',
              },
            }}
            onLoadPaymentData={paymentRequest => {
              console.log('load payment data', paymentRequest, Payment);
            }}
          />
          <button onClick={() => setShowPayModal(false)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
              Cancelar
          </button>
        </div>
      </div>
     )
    }

    const Payment = (onLoadPaymentData) => {
      if (onLoadPaymentData && session) {
          if (!session?.user?.rol === 'premium') {
              cambiarRol();
          }
          return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
              <div className="bg-gradient-to-br from-purple-900 to-blue-900 border border-purple-500 rounded-2xl max-w-md w-full p-8 text-white relative shadow-2xl shadow-purple-500/20">
                <button onClick={() => setShowPayMethod(false)} className="absolute top-2 right-4 text-white/70 hover:text-white">
                    <X />
                </button>
                <h2 className='space-y-5 mb-5'>¡FELICIDADES! Has obtenido la membresía Premium.</h2>
                <button onClick={() => setShowPayModal(false)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                    Salir
                </button>
              </div>
            </div>
          )
      }
    }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="min-h-screen bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-indigo-900/80 p-4 sm:p-8 relative">

        {showPricingModal && <PricingModal />}
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-10 h-10 text-purple-300" />
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Atenea Digital</h1>
              <Brain className="w-10 h-10 text-purple-300" />
            </div>
            <p className="text-purple-200 text-xl max-w-2xl mx-auto">
              Transforma comentarios tóxicos en obras de arte. Protege tu paz mental, desarma el odio con inteligencia.
            </p>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column: Generator */}
            <div className="lg:col-span-3 space-y-6">

              {/* Input Section */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <label className="block text-white font-semibold mb-3">Comentario del Hater a Desarmar</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Pega aquí el comentario tóxico..."
                  className="w-full h-32 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none transition-all"
                />
                <div className="flex justify-between items-center mt-4">
                  {session?.user?.rol !== 'premium' && (
                  <div className="text-purple-200 text-sm">
                    <p>Respuestas gratuitas restantes: <span className="font-bold text-white">{Math.max(0, MAX_FREE_USES - usageCount)}/{MAX_FREE_USES}</span></p>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-1.5 rounded-full" style={{ width: `${((MAX_FREE_USES - usageCount) / MAX_FREE_USES) * 100}%` }}></div>
                    </div>
                  </div>
                  )}
                  <button
                    onClick={generateResponses}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Analizando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Generar Respuestas</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Responses */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 min-h-[30rem]">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-300" />
                  Respuestas Sugeridas
                </h2>
                <div className="space-y-4">
                  {responses.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-purple-200">
                      <p>Las respuestas aparecerán aquí.</p>
                      <p className="text-sm">Estás en modo demo. ¡Ingresa tu API key y un comentario para empezar!</p>
                    </div>
                  )}
                  {responses.map((res, index) => (
                    res.isLocked ? (
                      <div key={index} onClick={() => setShowPricingModal(true)} className="relative bg-white/5 rounded-lg p-5 border border-dashed border-white/20 cursor-pointer hover:border-purple-400 hover:bg-white/10 transition-all">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                          <Lock className="w-8 h-8 text-yellow-400 mb-2" />
                          <p className="font-bold text-white">Respuesta Premium</p>
                          <p className="text-sm text-purple-300">Actualiza para desbloquear</p>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getStrategyIcon(res.strategy)}</span>
                          <span className="text-purple-300 font-semibold">{res.strategy}</span>
                        </div>
                        <p className="text-white/30 leading-relaxed blur-sm select-none">
                          {res.text || "Esta es una respuesta de ejemplo para mostrar el contenido bloqueado."}
                        </p>
                      </div>
                    ) : (
                      <div key={index} className="bg-white/10 rounded-lg p-5 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getStrategyIcon(res.strategy)}</span>
                            <span className="text-purple-300 font-semibold">{res.strategy}</span>
                          </div>
                          <button onClick={() => copyToClipboard(res.text, index)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg transition-colors text-sm">
                            <Copy className="w-4 h-4" />
                            {copiedIndex === index ? 'Copiado!' : 'Copiar'}
                          </button>
                        </div>
                        <p className="text-white leading-relaxed">{res.text}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* Social Proof & Waitlist Section */}
          <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Testimonials & Stats */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-center">¿Por qué los creadores nos aman?</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{MOCK_STATS.responsesGenerated}+</p>
                  <p className="text-purple-200 text-sm">Respuestas Generadas</p>
                </div>
                <div>
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{MOCK_STATS.mentalPeaceRestored}</p>
                  <p className="text-purple-200 text-sm">Paz Mental Restaurada</p>
                </div>
                <div>
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{MOCK_STATS.audienceEngagementUp}</p>
                  <p className="text-purple-200 text-sm">Más Engagement Positivo</p>
                </div>
              </div>
              <div className="space-y-4">
                {MOCK_TESTIMONIALS.map((t, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-white mb-2">"{t.text}"</p>
                    <p className="font-bold text-purple-300">{t.name} <span className="text-purple-400 font-normal">{t.handle}</span></p>
                  </div>
                ))}
              </div>
            </div>

            {/* Waitlist */}
            <div className="bg-gradient-to-br from-purple-800 to-pink-800/80 rounded-xl p-8 border border-purple-500/50 sticky top-8">
              <h3 className="text-3xl font-bold mb-2">Sé el primero en saberlo.</h3>
              <p className="text-purple-200 mb-6">Estamos construyendo la versión completa de Atenea Digital con más estrategias, análisis de tono y más. Únete a la lista de espera para acceso anticipado y un descuento especial.</p>
              {showWaitlistSuccess ? (
                <div className="text-center bg-green-500/20 border border-green-500 text-green-300 rounded-lg p-4">
                  <CheckCircle className="mx-auto w-8 h-8 mb-2" />
                  <p className="font-bold">¡Estás en la lista!</p>
                  <p className="text-sm">Te avisaremos cuando lancemos.</p>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit}>
                  <input
                    type="email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    required
                    placeholder="tu.email@dominio.com"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
                  />
                  <button type="submit" className="w-full flex items-center justify-center gap-2 bg-white text-purple-900 font-bold py-3 rounded-lg transition-all transform hover:scale-105 hover:bg-purple-200">
                    <span>Unirme a la Waitlist</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </section>
   

          {/* Footer */}
          <footer className="text-center mt-16 text-purple-300 text-sm">
            <p>Powered by Google Gemini & React • Desarma el odio con inteligencia y humor.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AteneaDigitalMVP;