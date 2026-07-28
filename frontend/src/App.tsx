import React, { useState } from 'react';

interface DiagnosticResult {
  recomendacion: string;
  productosRecomendados: string[];
}

// URL pública de tu backend en GitHub Codespaces (Puerto 4000)
const BACKEND_URL = 'https://fluffy-journey-jr4rvjg44g9gcj7qp-4000.app.github.dev';

export default function App() {
  const [hairType, setHairType] = useState('Rizado');
  const [scalpCondition, setScalpCondition] = useState('Seco');
  const [mainIssue, setMainIssue] = useState('Frizz');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/diagnostic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hairType,
          scalpCondition,
          mainIssue,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el servidor.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="max-w-xl mx-auto mb-6">
        <h1 className="text-3xl font-extrabold text-emerald-900 tracking-wide">
          D' Y&C ORGANIC
        </h1>
        <p className="text-emerald-700 text-sm font-medium">
          Cuidado Capilar 100% Orgánico y Personalizado
        </p>
      </header>

      <main className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Análisis Personalizado de Cabello
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Tipo de Cabello
            </label>
            <select
              value={hairType}
              onChange={(e) => setHairType(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Rizado">Rizado</option>
              <option value="Liso">Liso</option>
              <option value="Ondulado">Ondulado</option>
              <option value="Afro">Afro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Estado del Cuero Cabelludo
            </label>
            <select
              value={scalpCondition}
              onChange={(e) => setScalpCondition(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Seco">Seco</option>
              <option value="Graso">Graso</option>
              <option value="Normal">Normal</option>
              <option value="Sensible">Sensible</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Problema Principal
            </label>
            <input
              type="text"
              value={mainIssue}
              onChange={(e) => setMainIssue(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="Ej. Frizz, Caída, Caspa..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Generando Diagnóstico...' : 'Obtener Diagnóstico Orgánico'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-3">
            <h3 className="font-bold text-emerald-900 text-lg">
              Diagnóstico Recomendado
            </h3>
            <p className="text-gray-700 text-sm">{result.recomendacion}</p>
            {result.productosRecomendados && (
              <div>
                <span className="font-semibold text-emerald-800 text-xs uppercase block mb-1">
                  Productos Sugeridos:
                </span>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {result.productosRecomendados.map((prod, idx) => (
                    <li key={idx}>{prod}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}