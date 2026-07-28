import React, { useState } from 'react';

export default function App() {
  const [hairType, setHairType] = useState('Rizado');
  const [scalpCondition, setScalpCondition] = useState('Seco');
  const [mainProblem, setMainProblem] = useState('Frizz');
  const [diagnosis, setDiagnosis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/ai/diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hairType, scalpCondition, mainProblem }),
      });
      const data = await res.json();
      setDiagnosis(data.diagnosis || data.reply || 'Diagnóstico listo.');
    } catch (error) {
      console.error(error);
      setDiagnosis('Error al conectar con el backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-green-800">D' Y&C ORGANIC</h1>
        <p className="text-gray-600">Cuidado Capilar 100% Orgánico y Personalizado</p>
      </header>

      <main className="max-w-2xl bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Análisis Personalizado de Cabello</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Cabello</label>
            <select 
              value={hairType} 
              onChange={(e) => setHairType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 border p-2"
            >
              <option value="Rizado">Rizado</option>
              <option value="Liso">Liso</option>
              <option value="Ondulado">Ondulado</option>
              <option value="Afro">Afro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estado del Cuero Cabelludo</label>
            <select 
              value={scalpCondition} 
              onChange={(e) => setScalpCondition(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 border p-2"
            >
              <option value="Seco">Seco</option>
              <option value="Graso">Graso</option>
              <option value="Normal">Normal</option>
              <option value="Sensible">Sensible</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Problema Principal</label>
            <input 
              type="text" 
              value={mainProblem} 
              onChange={(e) => setMainProblem(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 border p-2"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition"
          >
            {loading ? 'Consultando...' : 'Obtener Diagnóstico Orgánico'}
          </button>
        </form>

        {diagnosis && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-bold text-green-900 mb-2">Resultado:</h3>
            <p className="whitespace-pre-line text-gray-800">{diagnosis}</p>
          </div>
        )}
      </main>
    </div>
  );
}