import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

// Definición de las propiedades que recibe el componente CartDrawer
interface CartDrawerProps {
  isOpen: boolean;        // Controla si el cajón del carrito está abierto o cerrado
  onClose: () => void;    // Función para cerrar el cajón
  onCheckout: () => void; // Función para iniciar el proceso de pago
}

export const CartDrawer = ({ isOpen, onClose, onCheckout }: CartDrawerProps) => {
  // Extraemos del contexto del carrito los elementos, funciones de manipulación y el total
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  // Si el cajón no está abierto, no renderizamos nada en el DOM
  if (!isOpen) return null;

  return (
    // Contenedor principal con fondo oscuro semitransparente (overlay)
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 flex justify-end">
      {/* Panel lateral del carrito (desplegable desde la derecha) */}
      <div className="w-full max-w-md bg-white h-full shadow-xl flex flex-col p-6">
        
        {/* Cabecera del carrito */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold">Tu Carrito de Compras</h2>
          {/* Botón para cerrar el panel */}
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">✕</button>
        </div>

        {/* Lista de productos en el carrito con scroll vertical si es necesario */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {cart.length === 0 ? (
            // Mensaje que se muestra si el carrito está vacío
            <p className="text-center text-gray-500 mt-10">Tu carrito está vacío.</p>
          ) : (
            // Mapeo de cada ítem presente en el carrito
            cart.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between border-b pb-3">
                <div>
                  {/* Nombre y precio unitario formateado del producto */}
                  <h4 className="font-semibold">{item.product.name}</h4>
                  <p className="text-sm text-gray-600">{formatPrice(item.product.price)}</p>
                </div>
                
                {/* Controles de cantidad y botón de eliminación */}
                <div className="flex items-center space-x-2">
                  {/* Botón para disminuir cantidad */}
                  <button onClick={() => updateQuantity(item.product.id, -1)} className="px-2 bg-gray-200 rounded">-</button>
                  <span>{item.quantity}</span>
                  {/* Botón para aumentar cantidad */}
                  <button onClick={() => updateQuantity(item.product.id, 1)} className="px-2 bg-gray-200 rounded">+</button>
                  {/* Botón para eliminar el producto por completo */}
                  <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 ml-2">🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sección inferior: Muestra el total y el botón de pago (solo si hay productos) */}
        {cart.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Total:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Proceder al Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};