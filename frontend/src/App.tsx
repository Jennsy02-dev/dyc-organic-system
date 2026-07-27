import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'chat'>('diagnosis');
  
  // Estado para el formulario de diagnóstico
  const [hairType, setHairType] = useState('rizado');
  const [scalpCondition, setScalpCondition] = useState('seco');
  const [mainProblem, setMainProblem] = useState('frizz');
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);

  // Estado para el Chatbot
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'model', content: "¡Hola! Soy Yoly, tu asesora capilar orgánica de D' Y&C ORGANIC. ¿En qué te puedo ayudar hoy?" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  // Enviar Diagnóstico
  const handleDiagnosisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingDiagnosis(true);
    setDiagnosisResult(null);

    try {
      const res = await fetch('/api/v1/ai/diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hairType, scalpCondition, mainProblem })
      });
      const data = await res.json();
      if (data.success) {
        setDiagnosisResult(data.diagnosis);
      } else {
        setDiagnosisResult('Error al generar el diagnóstico: ' + data.error);
      }
    } catch (err) {
      setDiagnosisResult('Error de conexión con el servidor.');
    } finally {
      setLoadingDiagnosis(false);
    }
  };

  // Enviar Mensaje al Chatbot
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessages = [...messages, { role: 'user', content: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');
    setLoadingChat(true);

    try {
      const res = await fetch('/api/v1/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...newMessages, { role: 'model', content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: 'model', content: 'Lo siento, ocurrió un error en la consulta.' }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'model', content: 'Error de conexión con el servidor.' }]);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800">
      {/* Encabezado */}
      <header className="bg-emerald-800 text-white p-6 shadow-md text-center">
        <h1 className="text-3xl font-bold tracking-wide">D' Y&C ORGANIC</h1>
        <p className="text-emerald-200 text-sm mt-1">Cuidado Capilar 100% Orgánico y Personalizado</p>
      </header>

      {/* Navegación por Pestañas */}
      <div className="flex justify-center bg-emerald-900 text-white">
        <button
          onClick={() => setActiveTab('diagnosis')}
          className={`px-6 py-3 font-medium transition ${activeTab === 'diagnosis' ? 'bg-stone-50 text-emerald-900 font-bold border-t-4 border-amber-500' : 'hover:bg-emerald-800'}`}
        >
          Diagnóstico Capilar IA
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-6 py-3 font-medium transition ${activeTab === 'chat' ? 'bg-stone-50 text-emerald-900 font-bold border-t-4 border-amber-500' : 'hover:bg-emerald-800'}`}
        >
          Asesora Virtual Yoly
        </button>
      </div>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6">
        {activeTab === 'diagnosis' ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <h2 className="text-2xl font-bold text-emerald-900 mb-4">Análisis Personalizado de Cabello</h2>
            <form onSubmit={handleDiagnosisSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Cabello:</label>
                <select value={hairType} onChange={e => setHairType(e.target.value)} className="w-full p-2 border rounded-md">
                  <option value="liso">Liso</option>
                  <option value="ondulado">Ondulado</option>
                  <option value="rizado">Rizado</option>
                  <option value="afro">Afro / Encrespado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estado del Cuero Cabelludo:</label>
                <select value={scalpCondition} onChange={e => setScalpCondition(e.target.value)} className="w-full p-2 border rounded-md">
                  <option value="seco">Seco</option>
                  <option value="graso">Graso</option>
                  <option value="sensible / irritado">Sensible / Irritado</option>
                  <option value="normal">Normal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Problema Principal:</label>
                <input
                  type="text"
                  value={mainProblem}
                  onChange={e => setMainProblem(e.target.value)}
                  placeholder="Ej: Frizz, caida, falta de brillo, puntas abiertas..."
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loadingDiagnosis}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-md transition disabled:opacity-50"
              >
                {loadingDiagnosis ? 'Analizando tu cabello...' : 'Obtener Diagnóstico Orgánico'}
              </button>
            </form>

            {diagnosisResult && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-md">
                <h3 className="font-bold text-emerald-900 mb-2">Recomendación Personalizada:</h3>
                <div className="whitespace-pre-line text-stone-700">{diagnosisResult}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 flex flex-col h-[500px]">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">Chatea con Yoly</h2>
            
            <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-stone-50 rounded-md border border-stone-100 mb-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'user' ? 'bg-emerald-700 text-white' : 'bg-white border border-stone-200 text-stone-800'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loadingChat && <div className="text-stone-400 text-sm">Yoly está escribiendo...</div>}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Haz una pregunta sobre productos o cuidados..."
                className="flex-1 p-2 border rounded-md"
              />
              <button
                type="submit"
                disabled={loadingChat}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2 rounded-md transition disabled:opacity-50"
              >
                Enviar
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}