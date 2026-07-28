/**
 * App.tsx - Componente Principal de D' Y&C ORGANIC (Versión Full Features)
 */

import React, { useState, useEffect } from 'react';
import Chatbot from './components/Chatbot'; 

// ==========================================
// 1. INTERFACES & DEFINICIÓN DE TIPOS
// ==========================================

interface Product {
  id: number;
  name: string;
  category: 'capilar' | 'jabones';
  price: number;
  description: string;
  badge?: string;
  icon: string;
  ingredients?: string[];
  benefits?: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface DiagnosticResult {
  recomendacion: string;
  productosRecomendados: string[];
}

interface Testimonial {
  id: number;
  name: string;
  comment: string;
  rating: number;
  location: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

// ==========================================
// 2. CONFIGURACIÓN GENERAL Y CONSTANTES
// ==========================================

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://fluffy-journey-jr4rvjg44g9gcj7qp-4000.app.github.dev';
const WHATSAPP_NUMBER = '18090000000'; 

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Shampoo Orgánico Crecimiento & Nutrición",
    category: "capilar",
    price: 15.00,
    description: "Limpia suavemente sin sulfatos, estimulando el crecimiento desde la raíz.",
    badge: "Más Vendido",
    icon: "🧴",
    ingredients: ["Aceite de Rosas", "Biotina Natural", "Extracto de Romero", "Aloe Vera"],
    benefits: ["Estimula el folículo piloso", "Libre de sulfatos y parabenos", "Aporta brillo y suavidad"]
  },
  {
    id: 2,
    name: "Acondicionador Restaurador de Aceites",
    category: "capilar",
    price: 14.00,
    description: "Desenreda e hidrata profundamente la hebra maltratada.",
    icon: "🌿",
    ingredients: ["Manteca de Karité", "Aceite de Argán", "Glicerina Vegetal"],
    benefits: ["Desenredado instantáneo", "Reparación de puntas abiertas", "Hidratación prolongada"]
  },
  {
    id: 3,
    name: "Gotero Capilar Anti-Caída Tónico Orgánico",
    category: "capilar",
    price: 20.00,
    description: "Fortalece el folículo piloso y frena la caída de forma natural.",
    badge: "Recomendado IA",
    icon: "💧",
    ingredients: ["Minoxidil Botánico", "Cebolla Morada Extracto", "Jengibre", "Canela"],
    benefits: ["Detiene la caída excesiva", "Promueve nuevo crecimiento", "Activa la circulación capilar"]
  },
  {
    id: 4,
    name: "Sérum Capilar Anti-Frizz & Brillo",
    category: "capilar",
    price: 18.00,
    description: "Nutrición intensa para sellar puntas abiertas y controlar el encrespamiento.",
    icon: "✨",
    ingredients: ["Aceite de Jojoba", "Vitamina E", "Aceite de Coco Orgánico"],
    benefits: ["Control absoluto del frizz", "Protección térmica natural", "Toque sedoso sin grasa"]
  },
  {
    id: 5,
    name: "Jabón Artesanal de Avena & Miel",
    category: "jabones",
    price: 7.00,
    description: "Exfoliación suave e hidratación profunda para pieles sensibles.",
    badge: "Artesanal",
    icon: "🧼",
    ingredients: ["Avena coloidal", "Miel de abeja pura", "Aceite de oliva"],
    benefits: ["Calma irritaciones", "Exfoliación delicada", "Nutre pieles secas"]
  },
  {
    id: 6,
    name: "Jabón Humectante de Coco & Karité",
    category: "jabones",
    price: 7.50,
    description: "Piel suave, nutrida y protegida con ingredientes 100% naturales.",
    icon: "🥥",
    ingredients: ["Aceite de coco virgen", "Manteca de karité", "Aceite esencial de vainilla"],
    benefits: ["Hidratación profunda de larga duración", "Aroma relajante", "Espuma cremosa natural"]
  }
];

const TESTIMONIALS: Testimonial[] = [
  { id: 1, name: "Marielisa P.", comment: "¡El gotero capilar cambió mi vida! Noté menos caída en apenas dos semanas.", rating: 5, location: "Santiago" },
  { id: 2, name: "Johanna R.", comment: "Los jabones artesanales huelen increíble y no me resecan la piel para nada.", rating: 5, location: "Santo Domingo" },
  { id: 3, name: "Carla M.", comment: "Me encanta que sean productos 100% naturales y libres de químicos agresivos.", rating: 5, location: "La Vega" }
];

const FAQS: FAQItem[] = [
  { question: "¿Los productos contienen sulfatos o parabenos?", answer: "No, toda nuestra línea capilar y jabones artesanales son 100% libres de sulfatos, parabenos y químicos agresivos." },
  { question: "¿Cómo se realizan los envíos?", answer: "Hacemos envíos seguros a toda la República Dominicana coordinando directamente vía WhatsApp tras confirmar tu pedido." },
  { question: "¿Cómo sé cuál producto elegir?", answer: "Puedes utilizar nuestra herramienta gratuita de 'Diagnóstico IA' en el menú para obtener una recomendación totalmente personalizada a tu tipo de cabello." }
];

// ==========================================
// 3. COMPONENTE PRINCIPAL (App)
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState<'tienda' | 'diagnostico' | 'nosotros'>('tienda');
  const [filter, setFilter] = useState<'todos' | 'capilar' | 'jabones'>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estados de Favoritos (Wishlist)
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  // Estado Modal Vista Rápida de Producto
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Estado Acordeón FAQ
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [step, setStep] = useState<number>(1);
  const [hairType, setHairType] = useState<string>('Rizado');
  const [scalpCondition, setScalpCondition] = useState<string>('Seco');
  const [mainIssue, setMainIssue] = useState<string>('Frizz');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isCartOpen || selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen, selectedProduct]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        showToast("Removido de favoritos");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("¡Añadido a tus favoritos! ❤️");
        return [...prev, productId];
      }
    });
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`¡Agregado: ${product.name} (x${quantity})!`);
    setSelectedProduct(null);
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

  // Filtrado avanzado de productos (Buscador + Categoría + Favoritos)
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = filter === 'todos' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFavorites = !showOnlyFavorites || favorites.includes(p.id);
    return matchesCategory && matchesSearch && matchesFavorites;
  });

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
      setError(err.message || 'Ocurrió un error inesperado al procesar el diagnóstico.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans flex flex-col justify-between relative">
      <div>
        {/* 1. TOP BAR / ANUNCIO SUPERIOR ROTATIVO */}
        <div className="bg-amber-400 text-slate-900 text-xs font-bold py-2 px-4 text-center tracking-wide flex justify-center items-center gap-2 shadow-sm">
          <span>🚚 ¡Envíos disponibles a toda la República Dominicana!</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">✨ 100% Orgánico y Artesanal</span>
        </div>

        {/* TOAST NOTIFICATION FLOTANTE */}
        {toastMessage && (
          <div className="fixed top-16 right-5 z-50 bg-emerald-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
            <span>✨</span> {toastMessage}
          </div>
        )}

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav className="bg-emerald-950 text-white sticky top-0 z-40 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setActiveTab('tienda'); setMobileMenuOpen(false); }}>
              <span className="text-2xl">🌿</span>
              <span className="font-extrabold text-xl tracking-wider text-emerald-100">D' Y&C ORGANIC</span>
            </div>

            {/* Enlaces Desktop */}
            <div className="hidden md:flex items-center space-x-3 text-sm font-medium">
              <button
                onClick={() => setActiveTab('tienda')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'tienda' ? 'bg-emerald-800 text-emerald-200 font-bold shadow-inner' : 'text-gray-200 hover:bg-emerald-900'}`}
              >
                Tienda
              </button>
              <button
                onClick={() => setActiveTab('nosotros')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'nosotros' ? 'bg-emerald-800 text-emerald-200 font-bold shadow-inner' : 'text-gray-200 hover:bg-emerald-900'}`}
              >
                Sobre Nosotros & FAQ
              </button>
              <button
                onClick={() => setActiveTab('diagnostico')}
                className={`px-3.5 py-1.5 rounded-full transition-all text-xs uppercase font-bold tracking-wider cursor-pointer ${activeTab === 'diagnostico' ? 'bg-amber-500 text-slate-900 shadow-md' : 'bg-emerald-800 hover:bg-emerald-700 text-white'}`}
              >
                Diagnóstico IA ✨
              </button>
            </div>

            {/* Icono Carrito & Menú Hamburguesa */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative cursor-pointer bg-emerald-900 p-2.5 rounded-full hover:bg-emerald-800 transition-colors flex items-center justify-center shadow-sm"
              >
                🛒 <span className="text-xs bg-amber-500 text-slate-900 font-bold px-1.5 py-0.5 rounded-full ml-1">{totalCartItems}</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white text-xl p-2 focus:outline-none cursor-pointer"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {/* Menú Desplegable Móvil */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-emerald-900 px-4 pt-2 pb-4 space-y-2 border-t border-emerald-800 shadow-lg">
              <button
                onClick={() => { setActiveTab('tienda'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer ${activeTab === 'tienda' ? 'bg-emerald-800 text-emerald-200' : 'text-gray-200'}`}
              >
                Tienda
              </button>
              <button
                onClick={() => { setActiveTab('nosotros'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer ${activeTab === 'nosotros' ? 'bg-emerald-800 text-emerald-200' : 'text-gray-200'}`}
              >
                Sobre Nosotros & FAQ
              </button>
              <button
                onClick={() => { setActiveTab('diagnostico'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer ${activeTab === 'diagnostico' ? 'bg-amber-500 text-slate-900 font-bold' : 'text-emerald-100'}`}
              >
                Diagnóstico IA ✨
              </button>
            </div>
          )}
        </nav>

        {/* MODAL / VISTA RÁPIDA DE PRODUCTO */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="bg-emerald-50 rounded-2xl h-48 flex items-center justify-center text-7xl relative">
                {selectedProduct.badge && (
                  <span className="absolute top-3 right-3 bg-amber-400 text-slate-900 font-extrabold text-xs uppercase px-2.5 py-1 rounded-full">
                    {selectedProduct.badge}
                  </span>
                )}
                {selectedProduct.icon}
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  {selectedProduct.category === 'capilar' ? 'Cuidado Capilar' : 'Jabón Artesanal'}
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-1 mb-2">{selectedProduct.name}</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{selectedProduct.description}</p>
              </div>

              {selectedProduct.ingredients && (
                <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-xs text-gray-900 uppercase">Ingredientes Activos:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.ingredients.map((ing, idx) => (
                      <span key={idx} className="bg-emerald-100 text-emerald-900 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                        🌿 {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.benefits && (
                <div className="space-y-1.5">
                  <h4 className="font-bold text-xs text-gray-900 uppercase">Beneficios Principales:</h4>
                  <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                    {selectedProduct.benefits.map((ben, idx) => (
                      <li key={idx}>{ben}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-2xl font-black text-gray-900">${selectedProduct.price.toFixed(2)}</span>
                <button
                  onClick={() => addToCart(selectedProduct, 1)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all text-sm cursor-pointer"
                >
                  Añadir al Carrito 🛒
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PANEL LATERAL DEL CARRITO (DRAWER) */}
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

        {/* VISTA 1: TIENDA & CATÁLOGO */}
        {activeTab === 'tienda' && (
          <main className="max-w-6xl mx-auto px-4 mt-6">
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
                    onClick={() => setActiveTab('diagnostico')}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-5 py-3 rounded-xl transition-all shadow-md text-sm cursor-pointer"
                  >
                    Descubrir mi Rutina Ideal ✨
                  </button>
                </div>
              </div>
            </section>

            {/* BARRA DE BÚSQUEDA Y FILTROS */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar shampoo, gotero, jabón..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex bg-gray-200 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setFilter('todos')}
                    className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${filter === 'todos' ? 'bg-white text-emerald-950 shadow' : 'text-gray-600'}`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFilter('capilar')}
                    className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${filter === 'capilar' ? 'bg-white text-emerald-950 shadow' : 'text-gray-600'}`}
                  >
                    Capilar
                  </button>
                  <button
                    onClick={() => setFilter('jabones')}
                    className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${filter === 'jabones' ? 'bg-white text-emerald-950 shadow' : 'text-gray-600'}`}
                  >
                    Jabones
                  </button>
                </div>

                <button
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                    showOnlyFavorites ? 'bg-rose-500 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span>❤️</span> Favoritos ({favorites.length})
                </button>
              </div>
            </div>

            {/* GRILLA DE PRODUCTOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-16 text-gray-400 space-y-2">
                  <div className="text-5xl">🌿</div>
                  <p className="font-semibold text-base">No se encontraron productos</p>
                  <p className="text-xs">Intenta con otra búsqueda o filtro.</p>
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const isFav = favorites.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
                    >
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                          isFav ? 'bg-rose-50 text-rose-500' : 'bg-white/80 text-gray-400 hover:text-rose-500'
                        }`}
                      >
                        {isFav ? '❤️' : '🤍'}
                      </button>

                      <div onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                        <div className="bg-emerald-50 rounded-xl h-40 flex items-center justify-center text-6xl mb-4 relative overflow-hidden">
                          {product.badge && (
                            <span className="absolute top-3 left-3 bg-amber-400 text-slate-900 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full">
                              {product.badge}
                            </span>
                          )}
                          {product.icon}
                        </div>
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                          {product.category === 'capilar' ? 'Cuidado Capilar' : 'Jabón Artesanal'}
                        </span>
                        <h3 className="font-bold text-gray-900 text-lg mt-1 mb-2 hover:text-emerald-800 transition-colors">{product.name}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed mb-4">{product.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedProduct(product)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                          >
                            Ver más
                          </button>
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>+ Añadir</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* SECCIÓN DE TESTIMONIOS (PRUEBA SOCIAL) */}
            <section className="mb-16 bg-emerald-900/5 rounded-3xl p-8 border border-emerald-900/10">
              <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                  Prueba Social
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900">Lo que dicen nuestras clientas</h2>
                <p className="text-gray-600 text-xs">Experiencias reales con nuestros productos artesanales y orgánicos.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((t) => (
                  <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                    <div className="text-amber-400 text-sm">★★★★★</div>
                    <p className="text-gray-700 text-xs leading-relaxed italic">"{t.comment}"</p>
                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-900">{t.name}</span>
                      <span className="text-gray-400">{t.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        )}

        {/* VISTA 2: SOBRE NOSOTROS & FAQ */}
        {activeTab === 'nosotros' && (
          <main className="max-w-4xl mx-auto px-4 mt-8 mb-12 space-y-10">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                  Nuestra Historia
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900">Sobre D' Y&C ORGANIC</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Creemos en el poder transformador de la naturaleza. Formulamos productos libres de químicos agresivos para cuidar y restaurar la salud de tu cabello y piel de forma artesanal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                <div className="p-5 bg-slate-50 rounded-2xl text-center space-y-2">
                  <div className="text-3xl">🌱</div>
                  <h4 className="font-bold text-gray-900 text-sm">100% Orgánico</h4>
                  <p className="text-xs text-gray-500">Ingredientes naturales cuidadosamente seleccionados sin sulfatos ni parabenos.</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl text-center space-y-2">
                  <div className="text-3xl">🧼</div>
                  <h4 className="font-bold text-gray-900 text-sm">Elaboración Artesanal</h4>
                  <p className="text-xs text-gray-500">Cada lote de jabones y productos capilares es hecho a mano con amor y precisión.</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl text-center space-y-2">
                  <div className="text-3xl">💚</div>
                  <h4 className="font-bold text-gray-900 text-sm">Cuidado Personalizado</h4>
                  <p className="text-xs text-gray-500">Te ayudamos a encontrar la rutina perfecta según tu tipo de cabello e inquietudes.</p>
                </div>
              </div>
            </div>

            {/* PREGUNTAS FRECUENTES (FAQ) INTERACTIVAS */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-6">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                  Dudas Comunes
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900">Preguntas Frecuentes</h2>
              </div>

              <div className="space-y-3 max-w-2xl mx-auto">
                {FAQS.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden transition-all">
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full p-4 text-left font-bold text-sm text-gray-900 bg-slate-50 hover:bg-slate-100 flex justify-between items-center cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <span className="text-emerald-800 font-extrabold text-lg">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-white text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        )}

        {/* VISTA 3: DIAGNÓSTICO CON IA */}
        {activeTab === 'diagnostico' && (
          <main className="max-w-2xl mx-auto px-4 mt-8 mb-12">
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

      {/* FOOTER GENERAL */}
      <footer className="bg-emerald-950 text-emerald-100 pt-10 pb-6 border-t border-emerald-900">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-sm">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌿</span>
              <span className="font-extrabold text-lg text-white">D' Y&C ORGANIC</span>
            </div>
            <p className="text-emerald-300/80 text-xs leading-relaxed">
              Productos capilares y jabones artesanales elaborados con ingredientes 100% orgánicos para cuidar de ti y de los tuyos.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Contacto & Envíos</h4>
            <ul className="space-y-2 text-xs text-emerald-200/90">
              <li>📍 República Dominicana</li>
              <li>💬 WhatsApp Directo para Pedidos</li>
              <li>🚚 Envíos a todo el país</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Enlaces Rápidos</h4>
            <div className="flex flex-col space-y-2 text-xs text-emerald-200/90">
              <button onClick={() => setActiveTab('tienda')} className="hover:text-amber-400 text-left cursor-pointer">Tienda & Productos</button>
              <button onClick={() => setActiveTab('nosotros')} className="hover:text-amber-400 text-left cursor-pointer">Preguntas Frecuentes</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot Flotante */}
      <Chatbot />
    </div>
  );
}