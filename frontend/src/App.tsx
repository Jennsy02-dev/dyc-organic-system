import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  category: 'capilar' | 'jabones';
  price: number;
  description: string;
  badge?: string;
  icon: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface DiagnosticResult {
  recomendacion: string;
  productosRecomendados: string[];
}

const BACKEND_URL = 'https://fluffy-journey-jr4rvjg44g9gcj7qp-4000.app.github.dev';

// Configura tu número de WhatsApp aquí (con código de país, ej: 18091234567 para RD)
const WHATSAPP_NUMBER = '18090000000'; 

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Shampoo Orgánico Crecimiento & Nutrición",
    category: "capilar",
    price: 15.00,
    description: "Limpia suavemente sin sulfatos, estimulando el crecimiento desde la raíz.",
    badge: "Más Vendido",
    icon: "🧴"
  },
  {
    id: 2,
    name: "Acondicionador Restaurador de Aceites",
    category: "capilar",
    price: 14.00,
    description: "Desenreda e hidrata profundamente la hebra maltratada.",
    icon: "🌿"
  },
  {
    id: 3,
    name: "Gotero Capilar Anti-Caída Tónico Orgánico",
    category: "capilar",
    price: 20.00,
    description: "Fortalece el folículo piloso y frena la caída de forma natural.",
    badge: "Recomendado IA",
    icon: "💧"
  },
  {
    id: 4,
    name: "Sérum Capilar Anti-Frizz & Brillo",
    category: "capilar",
    price: 18.00,
    description: "Nutrición intensa para sellar puntas abiertas y controlar el encrespamiento.",
    icon: "✨"
  },
  {
    id: 5,
    name: "Jabón Artesanal de Avena & Miel",
    category: "jabones",
    price: 7.00,
    description: "Exfoliación suave e hidratación profunda para pieles sensibles.",
    badge: "Artesanal",
    icon: "🧼"
  },
  {
    id: 6,
    name: "Jabón Humectante de Coco & Karité",
    category: "jabones",
    price: 7.50,
    description: "Piel suave, nutrida y protegida con ingredientes 100% naturales.",
    icon: "🥥"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'tienda' | 'diagnostico'>('tienda');
  const [filter, setFilter] = useState<'todos' | 'capilar' | 'jabones'>('todos');
  
  // Estado del Carrito
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estados del Diagnóstico IA
  const [step, setStep] = useState(1);
  const [hairType, setHairType] = useState('Rizado');
  const [scalpCondition, setScalpCondition] = useState('Seco');
  const [mainIssue, setMainIssue] = useState('Frizz');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Funciones del Carrito
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Generador de enlace de WhatsApp
  const sendWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let text = "🌿 *¡Hola D' Y&C ORGANIC! Quiero realizar el siguiente pedido:*\n\n";
    cart.forEach((item) => {
      text += `• ${item.product.name} (x${item.quantity}) - $${(item.product.price * item.quantity).toFixed(2)}\n`;
    });
    text += `\n💰 *Total a pagar:* $${totalPrice.toFixed(2)}\n\n`;
    text += "Quedo a la espera de sus datos para coordinar el pago y envío. ¡Gracias!";

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`, '_blank');
  };

  const filteredProducts = PRODUCTS.filter(
    (p) => filter === 'todos' || p.category === filter
  );

  const handleDiagnosisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/ai/diagnostic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ hairType, scalpCondition, mainIssue }),
      });

      if (!response.ok) throw new Error('Error al conectar con el servidor.');
      const data = await response.json();
      setResult(data);
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans pb-16 relative">
      {/* Navbar Superior */}
      <nav className="bg-emerald-950 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('tienda')}>
            <span className="text-2xl">🌿</span>
            <span className="font-extrabold text-xl tracking-wider text-emerald-100">D' Y&C ORGANIC</span>
          </div>

          <div className="flex items-center space-x-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('tienda')}
              className={`hover:text-emerald-300 transition-colors cursor-pointer ${activeTab === 'tienda' ? 'text-emerald-300 font-bold underline' : 'text-gray-200'}`}
            >
              Tienda & Productos
            </button>
            <button
              onClick={() => setActiveTab('diagnostico')}
              className={`px-3 py-1.5 rounded-full bg-emerald-800 hover:bg-emerald-700 transition-all text-xs uppercase font-bold tracking-wider cursor-pointer ${activeTab === 'diagnostico' ? 'ring-2 ring-emerald-300' : ''}`}
            >
              Diagnóstico Capilar IA
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative cursor-pointer bg-emerald-900 p-2 rounded-full hover:bg-emerald-800 transition-colors flex items-center justify-center"
            >
              🛒 <span className="text-xs bg-amber-500 text-slate-900 font-bold px-1.5 py-0.5 rounded-full ml-1">{totalCartItems}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* PANEL LATERAL DEL CARRITO */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6">
            <div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>🛒</span> Tu Carrito de Compras
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-400 space-y-2">
                  <div className="text-5xl mb-2">🛍️</div>
                  <p className="font-semibold text-sm">Tu carrito está vacío</p>
                  <p className="text-xs">¡Agrega productos orgánicos para iniciar tu pedido!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-3 bg-slate-50 border border-gray-100 rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{item.product.icon}</span>
                        <div>
                          <h4 className="font-bold text-xs text-gray-900">{item.product.name}</h4>
                          <span className="text-xs font-semibold text-emerald-800">${item.product.price.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded-md bg-gray-200 hover:bg-gray-300 font-bold text-xs flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded-md bg-emerald-800 text-white hover:bg-emerald-900 font-bold text-xs flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold ml-2 p-1 cursor-pointer"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TOTAL Y BOTÓN DE WHATSAPP */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between items-center text-lg font-extrabold text-gray-900">
                  <span>Total:</span>
                  <span className="text-emerald-900">${totalPrice.toFixed(2)}</span>
                </div>

                <button
                  onClick={sendWhatsAppOrder}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <span>💬</span> Pedir por WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VISTA 1: TIENDA & CATALOGO */}
      {activeTab === 'tienda' && (
        <main className="max-w-6xl mx-auto px-4 mt-6">
          {/* Banner Hero */}
          <section className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-3xl p-8 md:p-12 mb-10 shadow-xl relative overflow-hidden">
            <div className="max-w-xl space-y-4 relative z-10">
              <span className="bg-emerald-700/80 text-emerald-100 text-xs uppercase font-bold px-3 py-1 rounded-full">
                Línea Orgánica & Artesanal
              </span>
              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Resalta la belleza natural de tu cabello y piel
              </h1>
              <p className="text-emerald-100 text-sm md:text-base">
                Productos formulados con ingredientes 100% orgánicos, libres de sulfatos y parabenos.
              </p>
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setFilter('capilar')}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-5 py-3 rounded-xl transition-all shadow-md text-sm cursor-pointer"
                >
                  Ver Línea Capilar
                </button>
                <button
                  onClick={() => setActiveTab('diagnostico')}
                  className="bg-emerald-950/60 hover:bg-emerald-950 text-white font-semibold px-5 py-3 rounded-xl border border-emerald-600 transition-all text-sm cursor-pointer"
                >
                  Descubrir mi Rutina Ideal ✨
                </button>
              </div>
            </div>
          </section>

          {/* Filtros de Categoría */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Catálogo de Productos</h2>
            <div className="flex bg-gray-200 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilter('todos')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${filter === 'todos' ? 'bg-white text-emerald-950 shadow' : 'text-gray-600'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('capilar')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${filter === 'capilar' ? 'bg-white text-emerald-950 shadow' : 'text-gray-600'}`}
              >
                Línea Capilar
              </button>
              <button
                onClick={() => setFilter('jabones')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${filter === 'jabones' ? 'bg-white text-emerald-950 shadow' : 'text-gray-600'}`}
              >
                Jabones Artesanales
              </button>
            </div>
          </div>

          {/* Grilla de Productos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="bg-emerald-50 rounded-xl h-40 flex items-center justify-center text-6xl mb-4 relative">
                    {product.badge && (
                      <span className="absolute top-3 right-3 bg-amber-400 text-slate-900 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full">
                        {product.badge}
                      </span>
                    )}
                    {product.icon}
                  </div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    {product.category === 'capilar' ? 'Cuidado Capilar' : 'Jabón Artesanal'}
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg mt-1 mb-2">{product.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">{product.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
                  <button
                    onClick={() => {
                      addToCart(product);
                      setIsCartOpen(true);
                    }}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Añadir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* VISTA 2: DIAGNÓSTICO CON IA */}
      {activeTab === 'diagnostico' && (
        <main className="max-w-2xl mx-auto px-4 mt-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
              Asesoría Personalizada
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-3 mb-2">Diagnóstico Capilar D' Y&C</h2>
            <p className="text-gray-500 text-sm mb-6">
              Responde estas breves preguntas y te recomendaremos los productos ideales para la salud de tu cabello.
            </p>

            {step < 4 && (
              <div className="flex justify-between items-center mb-6 max-w-xs mx-auto">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        step === s ? 'bg-emerald-800 text-white shadow-md' : step > s ? 'bg-emerald-200 text-emerald-900' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {s}
                    </div>
                    {s < 3 && <div className={`w-12 h-1 ${step > s ? 'bg-emerald-300' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg text-gray-900">¿Cuál es tu tipo de cabello?</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'Liso', label: 'Liso', icon: '✨' },
                    { id: 'Ondulado', label: 'Ondulado', icon: '🌊' },
                    { id: 'Rizado', label: 'Rizado', icon: '🌀' },
                    { id: 'Afro', label: 'Afro', icon: '👑' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setHairType(item.id)}
                      className={`p-5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        hairType === item.id ? 'border-emerald-800 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-gray-200'
                      }`}
                    >
                      <div className="text-3xl mb-1">{item.icon}</div>
                      <div className="font-semibold text-sm">{item.label}</div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(2)} className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 rounded-xl transition-all cursor-pointer">
                  Siguiente
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg text-gray-900">Estado del cuero cabelludo</h3>
                <div className="space-y-3">
                  {['Seco', 'Graso', 'Normal', 'Sensible'].map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setScalpCondition(cond)}
                      className={`w-full p-4 rounded-xl border-2 text-left font-semibold cursor-pointer ${
                        scalpCondition === cond ? 'border-emerald-800 bg-emerald-50 text-emerald-900' : 'border-gray-200'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl cursor-pointer">
                    Atrás
                  </button>
                  <button onClick={() => setStep(3)} className="w-2/3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 rounded-xl cursor-pointer">
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleDiagnosisSubmit} className="space-y-6">
                <h3 className="font-bold text-lg text-gray-900">¿Qué buscas solucionar?</h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Problema Principal</label>
                  <input
                    type="text"
                    value={mainIssue}
                    onChange={(e) => setMainIssue(e.target.value)}
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-800 focus:outline-none"
                    placeholder="Ej. Control de Frizz, Caída, Brillo..."
                    required
                  />
                </div>
                {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl cursor-pointer">
                    Atrás
                  </button>
                  <button type="submit" disabled={loading} className="w-2/3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 rounded-xl cursor-pointer">
                    {loading ? 'Analizando...' : 'Generar Diagnóstico'}
                  </button>
                </div>
              </form>
            )}

            {step === 4 && result && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-emerald-900">Tu Rutina Sugerida</h3>
                <p className="text-gray-700 text-sm bg-slate-50 p-4 rounded-xl border border-gray-100">{result.recomendacion}</p>
                <div className="space-y-2">
                  <span className="font-bold text-xs uppercase tracking-wide text-gray-600">Productos Sugeridos:</span>
                  {result.productosRecomendados?.map((prod, idx) => (
                    <div key={idx} className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-950">
                      🌿 {prod}
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep(1)} className="w-full bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl cursor-pointer">
                  Realizar Otro Análisis
                </button>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}