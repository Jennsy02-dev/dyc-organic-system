import { useState, useEffect, useMemo } from 'react';

// --- INTERFACES & TYPES ---
interface Product {
  id: string;
  name: string;
  price: number;
  category: 'capilar' | 'lavado' | 'tratamiento' | 'combos';
  image: string;
  description: string;
  benefits: string[];
  rating: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// --- MOCK DATA ---
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Kit Crecimiento Intensivo Organic',
    price: 1250,
    category: 'combos',
    image: 'https://images.unsplash.com/photo-1608248597359-f5383a152399?auto=format&fit=crop&q=80&w=600',
    description: 'Tratamiento completo a base de extractos naturales para frenar la caída y estimular el crecimiento.',
    benefits: ['Estimula los folículos', 'Controla la grasa', 'Brillo extremo'],
    rating: 4.9,
    isBestSeller: true
  },
  {
    id: '2',
    name: 'Shampoo de Cebolla y Romero Sin Sal',
    price: 450,
    category: 'lavado',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600',
    description: 'Limpieza profunda que fortalece la hebra capilar desde la raíz gracias a las propiedades del romero.',
    benefits: ['Fortalece la hebra', 'Libre de sulfatos', 'Ideal para todo tipo de cabello'],
    rating: 4.8
  },
  {
    id: '3',
    name: 'Mascarilla Reparadora de Aguacate y Miel',
    price: 550,
    category: 'tratamiento',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
    description: 'Nutrición profunda para cabellos maltratados, secos o con procesos químicos.',
    benefits: ['Hidratación profunda', 'Reparación de puntas', 'Suavidad instantánea'],
    rating: 5.0,
    isNew: true
  },
  {
    id: '4',
    name: 'Gotero Mágico Anticaída',
    price: 380,
    category: 'capilar',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
    description: 'Concentrado de aceites esenciales puros para aplicar directamente en el cuero cabelludo.',
    benefits: ['Acción rápida', 'Fácil aplicación', 'Ingredientes 100% orgánicos'],
    rating: 4.7
  }
];

export function App() {
  // --- STATES ---
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dyc_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('dyc_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [, setIsCheckoutOpen] = useState<boolean>(false);
  const [, setIsDiagnosticOpen] = useState<boolean>(false);
  const [, setIsAdminOpen] = useState<boolean>(false);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('dyc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('dyc_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // --- HANDLERS ---
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(price);
  };

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cart]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'todos' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const sendWhatsAppOrder = () => {
    const itemsList = cart.map(i => `- ${i.quantity}x ${i.product.name} (${formatPrice(i.product.price * i.quantity)})`).join('%0A');
    const totalText = `%0A*Total:* ${formatPrice(totalPrice)}`;
    const message = `¡Hola D' Y&C ORGANIC! 👋 Deseo realizar el siguiente pedido:%0A%0A${itemsList}${totalText}`;
    window.open(`https://wa.me/18090000000?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-gray-800 antialiased selection:bg-[#24402F] selection:text-white">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedCategory('todos')}>
            <div className="w-10 h-10 rounded-full bg-[#24402F] flex items-center justify-center text-white font-bold text-xl shadow-md">
              🌿
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-[#24402F] leading-tight">D' Y&C ORGANIC</h1>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Natural Hair Care</p>
            </div>
          </div>

          {/* Search bar desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Busca shampoos, mascarillas, kits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-[#24402F]/20 focus:border-[#24402F] transition-all"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsDiagnosticOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#24402F]/10 hover:bg-[#24402F]/20 text-[#24402F] text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              ✨ Diagnóstico Capilar AI
            </button>

            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 text-gray-600 hover:text-[#24402F] hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-sm"
              title="Panel Administrativo"
            >
              ⚙️
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-[#24402F] text-white rounded-full hover:bg-[#2F5A3F] transition-colors shadow-md cursor-pointer flex items-center justify-center"
              aria-label="Abrir carrito de compras"
            >
              🛒
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section className="relative bg-[#24402F] text-white py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center space-y-4">
          <span className="bg-white/10 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
            100% Ingredientes Naturales
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl">
            La salud y vitalidad natural para tu cabello
          </h2>
          <p className="text-emerald-100/90 text-sm sm:text-base max-w-xl">
            Productos artesanales elaborados con amor y fórmulas especializadas para potenciar tu melena.
          </p>
          <div className="pt-2 flex flex-wrap gap-3 justify-center">
            <button 
              onClick={() => setSelectedCategory('combos')}
              className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold px-6 py-3 rounded-xl text-xs shadow-lg transition-all cursor-pointer"
            >
              Ver Combos Especiales
            </button>
            <button 
              onClick={() => setIsDiagnosticOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl text-xs border border-white/20 backdrop-blur-xs transition-all cursor-pointer lg:hidden"
            >
              ✨ Diagnóstico AI
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT CATALOG */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {['todos', 'combos', 'lavado', 'tratamiento', 'capilar'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-[#24402F] text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat === 'todos' ? 'Todos los productos' : cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-gray-500 font-medium self-end sm:self-center">
            Mostrando <span className="font-bold text-gray-800">{filteredProducts.length}</span> productos
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
            <span className="text-4xl mb-3 block">🔍</span>
            <h3 className="text-base font-bold text-gray-800">No encontramos productos</h3>
            <p className="text-xs text-gray-500 mt-1">Intenta ajustando tu búsqueda o cambiando de categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isFav = favorites.includes(product.id);
              return (
                <div 
                  key={product.id} 
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.isBestSeller && (
                        <span className="bg-amber-500 text-stone-900 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                          Más Vendido 🔥
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-[#24402F] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                          Nuevo 🌿
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-xs rounded-full shadow-xs hover:bg-white transition-colors cursor-pointer"
                      aria-label="Agregar a favoritos"
                    >
                      {isFav ? '❤️' : '🤍'}
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span className="capitalize font-medium">{product.category}</span>
                        <span className="text-amber-500 font-bold">★ {product.rating}</span>
                      </div>
                      <h3 className="font-display font-bold text-sm text-gray-800 group-hover:text-[#24402F] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Precio</span>
                        <span className="font-display font-bold text-base text-[#24402F]">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-[#24402F] hover:bg-[#2F5A3F] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                      >
                        Comprar 🛍️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsCartOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col p-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 className="font-display text-xl font-bold text-[#24402F]">Tu Carrito Organic</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Cerrar carrito"
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-3">
                    <span className="text-4xl">🛒</span>
                    <p className="text-sm">Tu carrito está vacío.</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-2 bg-[#24402F] text-white text-xs font-bold py-2 px-4 rounded-xl hover:bg-[#2F5A3F] transition-colors cursor-pointer"
                    >
                      Explorar Productos
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div 
                      key={item.product.id} 
                      className="flex items-center justify-between gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100"
                    >
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200" 
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xs text-gray-800 truncate">{item.product.name}</h3>
                        <p className="text-xs font-bold text-[#24402F] mt-0.5">{formatPrice(item.product.price)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-xs">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            aria-label={`Disminuir cantidad de ${item.product.name}`}
                            className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 cursor-pointer font-bold text-xs transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-gray-700">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            aria-label={`Aumentar cantidad de ${item.product.name}`}
                            className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 cursor-pointer font-bold text-xs transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          aria-label={`Eliminar ${item.product.name} del carrito`}
                          className="text-red-400 hover:text-red-600 text-xs font-bold cursor-pointer p-1.5 transition-colors rounded-lg hover:bg-red-50"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-gray-100 pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Total Estimado:</span>
                    <span className="font-display text-2xl font-bold text-[#24402F]">{formatPrice(totalPrice)}</span>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={sendWhatsAppOrder}
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
                    >
                      <span>💬</span> Pedir por WhatsApp
                    </button>

                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsCheckoutOpen(true);
                      }}
                      className="w-full bg-[#24402F] hover:bg-[#2F5A3F] text-white font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-xs shadow-xs"
                    >
                      Pagar con Tarjeta (Checkout) 💳
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-[#24402F]">D' Y&C ORGANIC — Belleza y Cuidado Natural</p>
          <p>© {new Date().getFullYear()} Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;