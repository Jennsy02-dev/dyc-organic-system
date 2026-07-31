/**
 * App.tsx - Componente Principal de D' Y&C ORGANIC (Versión Full Features Corregida)
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
  stock?: number;
}

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string | undefined;
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '18090000000';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';
const ADMIN_SESSION_KEY = 'dyc_admin_authed_v1';

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-DO', {
  style: 'currency',
  currency: 'USD',
});

const formatPrice = (value: number) => CURRENCY_FORMATTER.format(value);

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
    benefits: ["Detiene la caída excesiva", "Promueve nuevo crecimiento", "Activa la circulación capilar"],
    stock: 4
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

const HAIR_ISSUES = ['Frizz', 'Caída', 'Falta de Brillo', 'Resequedad', 'Puntas Abiertas', 'Caspa'];

const CART_STORAGE_KEY = 'dyc_cart_v1';
const FAVORITES_STORAGE_KEY = 'dyc_favorites_v1';
const PRODUCTS_STORAGE_KEY = 'dyc_admin_products_v1';
const NEWSLETTER_STORAGE_KEY = 'dyc_newsletter_subscribers_v1';

let nextLocalProductId = 1000;

// ==========================================
// 3. HELPERS DE ALMACENAMIENTO LOCAL
// ==========================================

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignorar si localStorage no está disponible
  }
}

// ==========================================
// 4. COMPONENTE PRINCIPAL (App)
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState<'tienda' | 'diagnostico' | 'nosotros' | 'admin'>('tienda');
  const [filter, setFilter] = useState<'todos' | 'capilar' | 'jabones'>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [products, setProducts] = useState<Product[]>(() => loadFromStorage(PRODUCTS_STORAGE_KEY, PRODUCTS));

  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({ name: '', email: '', phone: '', address: '', city: '' });
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(() => loadFromStorage(ADMIN_SESSION_KEY, false));
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [adminError, setAdminError] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage(CART_STORAGE_KEY, []));
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [favorites, setFavorites] = useState<number[]>(() => loadFromStorage(FAVORITES_STORAGE_KEY, []));
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [step, setStep] = useState<number>(1);
  const [hairType, setHairType] = useState<string>('Rizado');
  const [scalpCondition, setScalpCondition] = useState<string>('Seco');
  const [mainIssue, setMainIssue] = useState<string>('Frizz');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    saveToStorage(CART_STORAGE_KEY, cart);
  }, [cart]);

  useEffect(() => {
    saveToStorage(FAVORITES_STORAGE_KEY, favorites);
  }, [favorites]);

  useEffect(() => {
    saveToStorage(PRODUCTS_STORAGE_KEY, products);
  }, [products]);

  useEffect(() => {
    saveToStorage(ADMIN_SESSION_KEY, isAdminAuthed);
  }, [isAdminAuthed]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('producto');
    if (productId) {
      const found = products.find((p) => p.id === Number(productId));
      if (found) setSelectedProduct(found);
    }
  }, [products]);

  useEffect(() => {
    document.body.style.overflow = (isCartOpen || selectedProduct) ? 'hidden' : 'unset';
  }, [isCartOpen, selectedProduct]);

  useEffect(() => {
    if (!isCartOpen && !selectedProduct) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setSelectedProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, selectedProduct]);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        showToast("Removido de favoritos");
        return prev.filter((id) => id !== productId);
      }
      showToast("¡Añadido a tus favoritos! ❤️");
      return [...prev, productId];
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
  };

  const addToCartFromModal = (product: Product, quantity: number = 1) => {
    addToCart(product, quantity);
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
        .filter((item): item is CartItem => item !== null)
    );
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const openProductModal = (product: Product, element?: HTMLElement | null) => {
    if (element) lastFocusedElement.current = element;
    setSelectedProduct(product);
    const url = new URL(window.location.href);
    url.searchParams.set('producto', String(product.id));
    window.history.pushState({}, '', url);
    document.title = `${product.name} | D' Y&C ORGANIC`;
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    lastFocusedElement.current?.focus?.();
    const url = new URL(window.location.href);
    url.searchParams.delete('producto');
    window.history.pushState({}, '', url);
    document.title = "D' Y&C ORGANIC";
  };

  const sendWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let text = "🌿 *¡Hola D' Y&C ORGANIC! Quiero realizar el siguiente pedido:*\n\n";
    cart.forEach((item) => {
      text += `• ${item.product.name} (x${item.quantity}) - ${formatPrice(item.product.price * item.quantity)}\n`;
    });
    text += `\n💰 *Total a pagar:* ${formatPrice(totalPrice)}\n\n`;
    text += "Quedo a la espera de sus datos para coordinar el pago y envío. ¡Gracias!";

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`, '_blank', 'noopener,noreferrer');
  };

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = filter === 'todos' || p.category === filter;
      const matchesSearch = !term ||
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term);
      const matchesFavorites = !showOnlyFavorites || favorites.includes(p.id);
      return matchesCategory && matchesSearch && matchesFavorites;
    });
  }, [products, filter, searchTerm, showOnlyFavorites, favorites]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!BACKEND_URL) {
      setCheckoutError('El pago con tarjeta no está disponible todavía. Usa "Pedir por WhatsApp" mientras lo configuramos.');
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/checkout/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          customer: checkoutForm,
          items: cart.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            unitPrice: item.product.price,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) throw new Error('No se pudo iniciar el pago. Intenta de nuevo.');
      const data = await response.json();
      if (!data.url) throw new Error('El servidor no devolvió una URL de pago.');
      window.location.href = data.url;
    } catch (err: any) {
      setCheckoutError(err.message || 'Ocurrió un error inesperado al iniciar el pago.');
      setCheckoutLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      setNewsletterStatus('error');
      return;
    }

    setNewsletterStatus('loading');
    try {
      if (BACKEND_URL) {
        const response = await fetch(`${BACKEND_URL}/api/v1/newsletter/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (!response.ok) throw new Error('No se pudo suscribir.');
      } else {
        const existing = loadFromStorage<string[]>(NEWSLETTER_STORAGE_KEY, []);
        if (!existing.includes(email)) saveToStorage(NEWSLETTER_STORAGE_KEY, [...existing, email]);
      }
      setNewsletterStatus('success');
      setNewsletterEmail('');
      showToast('¡Gracias por suscribirte! 🌿');
    } catch {
      setNewsletterStatus('error');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ADMIN_PASSWORD) {
      setAdminError('No hay una clave de administrador configurada (VITE_ADMIN_PASSWORD).');
      return;
    }
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdminAuthed(true);
      setAdminError(null);
      setAdminPasswordInput('');
    } else {
      setAdminError('Clave incorrecta.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthed(false);
  };

  const updateProductField = (id: number, field: keyof Product, value: string | number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Producto eliminado');
  };

  const addNewProduct = () => {
    const newProduct: Product = {
      id: nextLocalProductId++,
      name: 'Nuevo producto',
      category: 'capilar',
      price: 0,
      description: '',
      icon: '🧴',
      stock: 0,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const restoreDefaultProducts = () => {
    if (window.confirm('Esto reemplazará todos tus cambios con el catálogo original. ¿Continuar?')) {
      setProducts(PRODUCTS);
      showToast('Catálogo restaurado a los valores originales');
    }
  };

  const resetDiagnostic = () => {
    setStep(1);
    setHairType('Rizado');
    setScalpCondition('Seco');
    setMainIssue('Frizz');
    setResult(null);
    setError(null);
  };

  const handleDiagnosisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!BACKEND_URL) {
      setError('El servicio de diagnóstico no está configurado. Contáctanos por WhatsApp.');
      return;
    }

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
    <div className="min-h-screen bg-[#FAF8F4] text-gray-800 font-['Manrope',_sans-serif] flex flex-col justify-between relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');

        .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }

        @keyframes dyc-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dyc-animate-in {
          animation: dyc-fade-up 0.5s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .dyc-animate-in { animation: none; }
        }
      `}</style>

      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-[#24402F] focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      >
        Saltar al contenido principal
      </a>

      <div>
        {/* TOP BAR */}
        <div className="bg-[#E7A94C] text-slate-900 text-xs font-bold py-2 px-4 text-center tracking-wide flex justify-center items-center gap-2 shadow-sm">
          <span>🚚 ¡Envíos disponibles a toda la República Dominicana!</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">✨ 100% Orgánico y Artesanal</span>
        </div>

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div
            role="status"
            aria-live="polite"
            className="fixed top-16 right-5 z-50 bg-[#24402F] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce"
          >
            <span aria-hidden="true">✨</span> {toastMessage}
          </div>
        )}

        {/* NAVEGACIÓN */}
        <nav className="bg-[#1C2B22] text-white sticky top-0 z-40 shadow-md" aria-label="Navegación principal">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <button
              type="button"
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => { setActiveTab('tienda'); setMobileMenuOpen(false); }}
            >
              <span className="text-2xl" aria-hidden="true">🌿</span>
              <span className="font-extrabold text-xl tracking-wider text-[#E7F1E7]">D' Y&C ORGANIC</span>
            </button>

            <div className="hidden md:flex items-center space-x-3 text-sm font-medium">
              <button
                onClick={() => setActiveTab('tienda')}
                aria-current={activeTab === 'tienda' ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'tienda' ? 'bg-[#2F5A3F] text-[#CFE3D2] font-bold shadow-inner' : 'text-gray-200 hover:bg-[#24402F]'}`}
              >
                Tienda
              </button>
              <button
                onClick={() => setActiveTab('nosotros')}
                aria-current={activeTab === 'nosotros' ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'nosotros' ? 'bg-[#2F5A3F] text-[#CFE3D2] font-bold shadow-inner' : 'text-gray-200 hover:bg-[#24402F]'}`}
              >
                Sobre Nosotros & FAQ
              </button>
              <button
                onClick={() => setActiveTab('diagnostico')}
                aria-current={activeTab === 'diagnostico' ? 'page' : undefined}
                className={`px-3.5 py-1.5 rounded-full transition-all text-xs uppercase font-bold tracking-wider cursor-pointer ${activeTab === 'diagnostico' ? 'bg-[#D89432] text-slate-900 shadow-md' : 'bg-[#2F5A3F] hover:bg-[#3C6B4C] text-white'}`}
              >
                Diagnóstico IA ✨
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label={`Abrir carrito de compras, ${totalCartItems} artículo(s)`}
                className="relative cursor-pointer bg-[#24402F] p-2.5 rounded-full hover:bg-[#2F5A3F] transition-colors flex items-center justify-center shadow-sm"
              >
                <span aria-hidden="true">🛒</span>
                <span className="text-xs bg-[#D89432] text-slate-900 font-bold px-1.5 py-0.5 rounded-full ml-1">{totalCartItems}</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={mobileMenuOpen}
                className="md:hidden text-white text-xl p-2 focus:outline-none cursor-pointer"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-[#24402F] px-4 pt-2 pb-4 space-y-2 border-t border-[#2F5A3F] shadow-lg">
              <button
                onClick={() => { setActiveTab('tienda'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer ${activeTab === 'tienda' ? 'bg-[#2F5A3F] text-[#CFE3D2]' : 'text-gray-200'}`}
              >
                Tienda
              </button>
              <button
                onClick={() => { setActiveTab('nosotros'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer ${activeTab === 'nosotros' ? 'bg-[#2F5A3F] text-[#CFE3D2]' : 'text-gray-200'}`}
              >
                Sobre Nosotros & FAQ
              </button>
              <button
                onClick={() => { setActiveTab('diagnostico'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer ${activeTab === 'diagnostico' ? 'bg-[#D89432] text-slate-900 font-bold' : 'text-[#E7F1E7]'}`}
              >
                Diagnóstico IA ✨
              </button>
            </div>
          )}
        </nav>

        {/* MODAL / VISTA RÁPIDA DE PRODUCTO */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={closeProductModal}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="product-modal-title"
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeProductModal}
                aria-label="Cerrar detalle de producto"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="bg-[#F4F8F3] rounded-2xl h-48 flex items-center justify-center text-7xl relative">
                {selectedProduct.badge && (
                  <span className="absolute top-3 right-3 bg-[#E7A94C] text-slate-900 font-extrabold text-xs uppercase px-2.5 py-1 rounded-full">
                    {selectedProduct.badge}
                  </span>
                )}
                <span aria-hidden="true">{selectedProduct.icon}</span>
              </div>

              <div>
                <span className="text-xs font-bold text-[#2F5A3F] uppercase tracking-wider">
                  {selectedProduct.category === 'capilar' ? 'Cuidado Capilar' : 'Jabón Artesanal'}
                </span>
                <h2 id="product-modal-title" className="font-display text-2xl font-bold text-gray-900 mt-1 mb-2">{selectedProduct.name}</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{selectedProduct.description}</p>
              </div>

              {selectedProduct.ingredients && (
                <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-xs text-gray-900 uppercase">Ingredientes Activos:</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.ingredients.map((ing, idx) => (
                      <span key={idx} className="bg-[#E7F1E7] text-[#24402F] text-xs font-semibold px-2.5 py-0.5 rounded-md">
                        🌿 {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.benefits && (
                <div className="space-y-1.5">
                  <h3 className="font-bold text-xs text-gray-900 uppercase">Beneficios Principales:</h3>
                  <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                    {selectedProduct.benefits.map((ben, idx) => (
                      <li key={idx}>{ben}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 block">Precio</span>
                  <span className="font-display text-2xl font-bold text-[#24402F]">{formatPrice(selectedProduct.price)}</span>
                </div>
                <button
                  onClick={() => addToCartFromModal(selectedProduct, 1)}
                  className="bg-[#24402F] hover:bg-[#2F5A3F] text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer text-sm"
                >
                  Añadir al Carrito 🛒
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CARRITO LATERAL (DRAWER) */}
        {isCartOpen && (
          <div
            className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-title"
              className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-4">
                  <h2 id="cart-title" className="font-display text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span>🛒</span> Tu Carrito ({totalCartItems})
                  </h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    aria-label="Cerrar carrito"
                    className="text-gray-400 hover:text-gray-600 text-lg font-bold cursor-pointer bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <span className="text-5xl" aria-hidden="true">🛒</span>
                    <p className="text-gray-500 font-medium">Tu carrito está vacío.</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-[#24402F] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Explorar Productos
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 divide-y divide-gray-100">
                    {cart.map((item) => (
                      <div key={item.product.id} className="pt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl bg-[#F4F8F3] p-2 rounded-xl">{item.product.icon}</span>
                          <div>
                            <h3 className="font-bold text-xs text-gray-900 line-clamp-1">{item.product.name}</h3>
                            <p className="text-xs text-[#24402F] font-bold mt-0.5">{formatPrice(item.product.price)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1)}
                              aria-label={`Disminuir cantidad de ${item.product.name}`}
                              className="px-2 py-0.5 text-gray-600 hover:bg-gray-200 cursor-pointer font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1)}
                              aria-label={`Aumentar cantidad de ${item.product.name}`}
                              className="px-2 py-0.5 text-gray-600 hover:bg-gray-200 cursor-pointer font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            aria-label={`Eliminar ${item.product.name}`}
                            className="text-red-400 hover:text-red-600 text-xs font-bold p-1 cursor-pointer"
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
                <div className="border-t pt-4 space-y-4">
                  <div className="flex justify-between items-center text-base font-bold text-gray-900">
                    <span>Total estimado:</span>
                    <span className="font-display text-xl text-[#24402F]">{formatPrice(totalPrice)}</span>
                  </div>

                  {isCheckoutOpen ? (
                    <form onSubmit={handleCheckoutSubmit} className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-gray-200">
                      <h3 className="font-bold text-xs uppercase text-gray-900">Datos de Envío y Pago</h3>
                      {checkoutError && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{checkoutError}</p>}
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        required
                        value={checkoutForm.name}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
                      />
                      <input
                        type="email"
                        placeholder="Correo electrónico"
                        required
                        value={checkoutForm.email}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
                      />
                      <input
                        type="tel"
                        placeholder="Teléfono / WhatsApp"
                        required
                        value={checkoutForm.phone}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Dirección exacta"
                        required
                        value={checkoutForm.address}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Ciudad / Sector"
                        required
                        value={checkoutForm.city}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsCheckoutOpen(false)}
                          className="w-1/2 bg-gray-200 text-gray-800 text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                        >
                          Volver
                        </button>
                        <button
                          type="submit"
                          disabled={checkoutLoading}
                          className="w-1/2 bg-[#D89432] hover:bg-[#c28126] text-slate-900 text-xs font-bold py-2.5 rounded-xl shadow cursor-pointer disabled:opacity-50"
                        >
                          {checkoutLoading ? 'Procesando...' : 'Pagar con Tarjeta 💳'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={sendWhatsAppOrder}
                        className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3 rounded-xl shadow transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
                      >
                        <span>💬</span> Pedir por WhatsApp
                      </button>
                      <button
                        onClick={() => setIsCheckoutOpen(true)}
                        className="w-full bg-[#24402F] hover:bg-[#2F5A3F] text-white font-bold py-3 rounded-xl shadow transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
                      >
                        <span>💳</span> Pagar con Tarjeta (Checkout Seguro)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <main id="contenido-principal" className="max-w-6xl mx-auto px-4 py-8 flex-grow">
          {activeTab === 'tienda' && (
            <div className="space-y-8 dyc-animate-in">
              {/* HERO SECTION */}
              <div className="bg-[#1C2B22] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#2F5A3F] rounded-full blur-3xl opacity-30 -mr-20 -mt-20 pointer-events-none" />
                <div className="space-y-4 max-w-lg relative z-10 text-center md:text-left">
                  <span className="bg-[#D89432] text-slate-900 text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                    Belleza 100% Natural 🌿
                  </span>
                  <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight text-[#FAF8F4]">
                    Nutrición real para tu cabello y piel
                  </h1>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Fórmulas artesanales libres de sulfatos y parabenos diseñadas para rescatar la vitalidad natural de tu melena.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                    <button
                      onClick={() => setActiveTab('diagnostico')}
                      className="bg-[#D89432] hover:bg-[#c28126] text-slate-900 font-bold px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer text-xs uppercase tracking-wider"
                    >
                      Diagnóstico Capilar IA ✨
                    </button>
                  </div>
                </div>
                <div className="text-8xl md:text-9xl bg-[#24402F] p-8 rounded-3xl shadow-inner relative z-10">
                  🌿
                </div>
              </div>

              {/* FILTROS Y BUSCADOR */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => { setFilter('todos'); setShowOnlyFavorites(false); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${filter === 'todos' && !showOnlyFavorites ? 'bg-[#24402F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => { setFilter('capilar'); setShowOnlyFavorites(false); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${filter === 'capilar' && !showOnlyFavorites ? 'bg-[#24402F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Cuidado Capilar
                  </button>
                  <button
                    onClick={() => { setFilter('jabones'); setShowOnlyFavorites(false); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${filter === 'jabones' && !showOnlyFavorites ? 'bg-[#24402F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Jabones Artesanales
                  </button>
                  <button
                    onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${showOnlyFavorites ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <span>❤️</span> Favoritos ({favorites.length})
                  </button>
                </div>

                <div className="w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* GRILLA DE PRODUCTOS */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 space-y-2 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <span className="text-4xl" aria-hidden="true">🔍</span>
                  <p className="text-gray-600 font-bold text-sm">No encontramos productos con esos criterios.</p>
                  <button
                    onClick={() => { setSearchTerm(''); setFilter('todos'); setShowOnlyFavorites(false); }}
                    className="text-xs text-[#24402F] font-bold underline cursor-pointer pt-2"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const isFav = favorites.includes(product.id);
                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow relative group"
                      >
                        <div>
                          <div className="bg-[#F4F8F3] rounded-2xl h-44 flex items-center justify-center text-6xl relative mb-4">
                            {product.badge && (
                              <span className="absolute top-3 left-3 bg-[#E7A94C] text-slate-900 font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full">
                                {product.badge}
                              </span>
                            )}
                            <button
                              onClick={() => toggleFavorite(product.id)}
                              aria-label={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                              className={`absolute top-3 right-3 p-2 rounded-full text-sm transition-colors cursor-pointer ${isFav ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500'}`}
                            >
                              {isFav ? '❤️' : '🤍'}
                            </button>
                            <span aria-hidden="true">{product.icon}</span>
                          </div>

                          <span className="text-[10px] font-bold text-[#2F5A3F] uppercase tracking-wider">
                            {product.category === 'capilar' ? 'Cuidado Capilar' : 'Jabón Artesanal'}
                          </span>
                          <h3
                            onClick={(e) => openProductModal(product, e.currentTarget)}
                            className="font-display text-lg font-bold text-gray-900 mt-1 mb-1.5 cursor-pointer hover:text-[#24402F] transition-colors"
                          >
                            {product.name}
                          </h3>
                          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">{product.description}</p>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 block">Precio</span>
                            <span className="font-display text-lg font-bold text-[#24402F]">{formatPrice(product.price)}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => openProductModal(product, e.currentTarget)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                            >
                              Ver detalle
                            </button>
                            <button
                              onClick={() => addToCart(product, 1)}
                              className="bg-[#24402F] hover:bg-[#2F5A3F] text-white text-xs font-bold px-3 py-2.5 rounded-xl shadow transition-all cursor-pointer"
                            >
                              + Añadir
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'nosotros' && (
            <div className="space-y-12 dyc-animate-in max-w-4xl mx-auto py-4">
              <div className="bg-[#1C2B22] text-white rounded-3xl p-8 md:p-12 space-y-4 shadow-xl text-center">
                <span className="bg-[#D89432] text-slate-900 text-xs font-extrabold uppercase px-3 py-1 rounded-full">
                  Nuestra Esencia 🌿
                </span>
                <h1 className="font-display text-3xl md:text-4xl font-bold">Hecho a mano con amor y propósito</h1>
                <p className="text-gray-300 text-sm leading-relaxed max-w-2xl mx-auto">
                  En D' Y&C ORGANIC creemos que el cuidado personal no debe comprometer tu salud ni la del planeta. Cada fórmula es elaborada con extractos botánicos puros.
                </p>
              </div>

              {/* SECCIÓN FAQ CON ACORDEÓN */}
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-gray-900 text-center">Preguntas Frecuentes (FAQ)</h2>
                <div className="space-y-3">
                  {FAQS.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          aria-expanded={isOpen}
                          className="w-full p-4 text-left font-bold text-sm text-gray-900 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                        >
                          <span>{faq.question}</span>
                          <span className="text-lg font-normal">{isOpen ? '−' : '+'}</span>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TESTIMONIOS */}
              <div className="space-y-6 pt-6">
                <h2 className="font-display text-2xl font-bold text-gray-900 text-center">Lo que dicen nuestras clientas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {TESTIMONIALS.map((t) => (
                    <div key={t.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 flex flex-col justify-between">
                      <p className="text-xs text-gray-600 italic leading-relaxed">"{t.comment}"</p>
                      <div className="border-t pt-3 flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-900">{t.name}</span>
                        <span className="text-gray-400">{t.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* NEWSLETTER */}
              <div className="bg-[#24402F] text-white rounded-3xl p-8 space-y-4 text-center">
                <h2 className="font-display text-xl font-bold">Suscríbete para recibir consejos de belleza y ofertas exclusivas</h2>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-grow text-xs p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:bg-white/20"
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === 'loading'}
                    className="bg-[#D89432] hover:bg-[#c28126] text-slate-900 font-bold px-6 py-3 rounded-xl text-xs cursor-pointer shadow"
                  >
                    {newsletterStatus === 'loading' ? 'Enviando...' : 'Suscribirme ✨'}
                  </button>
                </form>
                {newsletterStatus === 'success' && <p className="text-xs text-[#E7A94C] font-bold">¡Gracias por suscribirte con éxito!</p>}
                {newsletterStatus === 'error' && <p className="text-xs text-red-300">Por favor, introduce un correo válido.</p>}
              </div>
            </div>
          )}

          {activeTab === 'diagnostico' && (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 dyc-animate-in space-y-6">
              <div className="text-center space-y-2">
                <span className="bg-[#E7A94C] text-slate-900 text-xs font-extrabold uppercase px-3 py-1 rounded-full">
                  Inteligencia Artificial ✨
                </span>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">Diagnóstico Capilar Personalizado</h1>
                <p className="text-gray-500 text-xs">Responde 3 breves preguntas para que nuestra IA determine el tratamiento ideal para ti.</p>
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

              {step < 4 ? (
                <form onSubmit={(e) => { e.preventDefault(); if (step < 3) setStep(step + 1); else handleDiagnosisSubmit(e); }} className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-3">
                      <label className="block font-bold text-xs uppercase text-gray-700">1. ¿Cuál es tu tipo de cabello principal?</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Rizado', 'Lacio', 'Ondulado', 'Afro'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setHairType(type)}
                            className={`p-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${hairType === type ? 'border-[#24402F] bg-[#F4F8F3] text-[#24402F] shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-3">
                      <label className="block font-bold text-xs uppercase text-gray-700">2. ¿Cómo describirías tu cuero cabelludo?</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Seco', 'Graso', 'Mixto'].map((cond) => (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => setScalpCondition(cond)}
                            className={`p-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${scalpCondition === cond ? 'border-[#24402F] bg-[#F4F8F3] text-[#24402F] shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                            {cond}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-3">
                      <label className="block font-bold text-xs uppercase text-gray-700">3. ¿Cuál es tu principal problema o meta capilar?</label>
                      <div className="grid grid-cols-2 gap-2">
                        {HAIR_ISSUES.map((issue) => (
                          <button
                            key={issue}
                            type="button"
                            onClick={() => setMainIssue(issue)}
                            className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${mainIssue === issue ? 'border-[#24402F] bg-[#F4F8F3] text-[#24402F] shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                            {issue}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="bg-gray-100 text-gray-700 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                      >
                        Anterior
                      </button>
                    ) : <div />}
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#24402F] hover:bg-[#2F5A3F] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Analizando con IA...' : step === 3 ? 'Ver Resultado ✨' : 'Siguiente'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="bg-[#F4F8F3] p-6 rounded-3xl border border-gray-200 space-y-4">
                    <span className="text-4xl" aria-hidden="true">✨</span>
                    <h2 className="font-display text-xl font-bold text-gray-900">Tu Diagnóstico Personalizado</h2>
                    <p className="text-xs text-gray-600 leading-relaxed text-left bg-white p-4 rounded-2xl border border-gray-100">
                      {result?.recomendacion || 'Basado en tu tipo de cabello, te recomendamos nuestra línea botánica para restaurar la hidratación profunda.'}
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={resetDiagnostic}
                      className="bg-gray-100 text-gray-700 text-xs font-bold px-5 py-3 rounded-xl cursor-pointer"
                    >
                      Nuevo Diagnóstico
                    </button>
                    <button
                      onClick={() => setActiveTab('tienda')}
                      className="bg-[#24402F] text-white text-xs font-bold px-6 py-3 rounded-xl shadow cursor-pointer"
                    >
                      Ver Productos Recomendados 🛒
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 dyc-animate-in space-y-6">
              {!isAdminAuthed ? (
                <form onSubmit={handleAdminLogin} className="max-w-md mx-auto space-y-4 py-8">
                  <div className="text-center space-y-2">
                    <span className="text-3xl" aria-hidden="true">🔐</span>
                    <h1 className="font-display text-2xl font-bold">Panel de Administración</h1>
                    <p className="text-xs text-gray-500">Introduce la contraseña de administrador para gestionar el catálogo.</p>
                  </div>
                  {adminError && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{adminError}</p>}
                  <input
                    type="password"
                    placeholder="Contraseña (VITE_ADMIN_PASSWORD)"
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 bg-white"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#24402F] text-white text-xs font-bold py-3 rounded-xl shadow cursor-pointer"
                  >
                    Entrar al Panel
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h1 className="font-display text-xl font-bold flex items-center gap-2">
                      <span>🛠️</span> Gestión de Productos
                    </h1>
                    <div className="flex gap-2">
                      <button
                        onClick={addNewProduct}
                        className="bg-[#24402F] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                      >
                        + Nuevo Producto
                      </button>
                      <button
                        onClick={restoreDefaultProducts}
                        className="bg-gray-100 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Restaurar Originales
                      </button>
                      <button
                        onClick={handleAdminLogout}
                        className="bg-red-50 text-red-600 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {products.map((p) => (
                      <div key={p.id} className="bg-slate-50 p-4 rounded-2xl border border-gray-200 flex flex-col md:flex-row items-center gap-4 justify-between">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <span className="text-3xl bg-white p-2 rounded-xl shadow-sm">{p.icon}</span>
                          <div className="space-y-1 w-full">
                            <input
                              type="text"
                              value={p.name}
                              onChange={(e) => updateProductField(p.id, 'name', e.target.value)}
                              className="font-bold text-xs bg-white border border-gray-200 p-1 rounded w-full"
                            />
                            <input
                              type="text"
                              value={p.description}
                              onChange={(e) => updateProductField(p.id, 'description', e.target.value)}
                              className="text-xs text-gray-500 bg-white border border-gray-200 p-1 rounded w-full"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                          <input
                            type="number"
                            value={p.price}
                            onChange={(e) => updateProductField(p.id, 'price', Number(e.target.value))}
                            className="text-xs font-bold bg-white border border-gray-200 p-1 rounded w-20 text-right"
                          />
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="bg-red-100 text-red-600 text-xs font-bold p-2 rounded-xl cursor-pointer"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* CHATBOT INTEGRADO */}
      <Chatbot />

      {/* FOOTER */}
      <footer className="bg-[#1C2B22] text-gray-400 text-xs py-8 border-t border-[#24402F]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <p className="font-bold text-white text-sm">D' Y&C ORGANIC</p>
            <p className="mt-1">Belleza natural y cuidado artesanal desde la República Dominicana 🌿</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-white transition-colors cursor-pointer text-gray-500"
            >
              🔒 Panel Admin
            </button>
            <p>© {new Date().getFullYear()} Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}