/**
 * Chatbot.tsx - Asistente Virtual Flotante para D' Y&C ORGANIC
 */

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "¡Hola! 🌿 Soy el asistente virtual de D' Y&C ORGANIC. ¿En qué puedo ayudarte hoy sobre nuestras líneas orgánicas?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage.trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: currentTime
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Apunta a la URL de tu backend configurada en las variables de entorno
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const response = await fetch(`${backendUrl}/api/v1/chatbot/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();

      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply || "Gracias por tu mensaje.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, newBotMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "No se pudo conectar con el servidor en este momento.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* VENTANA DE CHAT */}
      {isOpen && (
        <div className="bg-white w-80 md:w-96 h-[480px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col justify-between overflow-hidden mb-4 transition-all">
          
          {/* Cabecera */}
          <div className="bg-emerald-950 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🤖</span>
              <div>
                <h3 className="font-bold text-sm leading-tight">Asistente D' Y&C</h3>
                <span className="text-[10px] text-emerald-300 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> En línea
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Mensajes */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-800 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {/* Indicador de escritura */}
            {loading && (
              <div className="flex flex-col items-start">
                <div className="bg-white text-gray-500 border border-gray-200 p-3 rounded-2xl rounded-bl-none text-xs shadow-sm animate-pulse">
                  Escribiendo respuesta...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input de envío */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu consulta..."
              disabled={loading}
              className="flex-1 text-xs p-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-800 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              Enviar
            </button>
          </form>
        </div>
      )}

      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-900 hover:bg-emerald-950 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer relative"
      >
        <span className="text-2xl">{isOpen ? '✕' : '💬'}</span>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"></span>
        )}
      </button>
    </div>
  );
}