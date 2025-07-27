// src/features/sorteio/componentes/HeaderSorteio.jsx
import React from 'react';
import { Settings, Edit2, Check, X } from 'lucide-react';

export default function HeaderSorteio({
  eventoTitulo,
  setEventoTitulo,
  editandoTitulo,
  setEditandoTitulo,
  salvarTitulo,
  cancelarEdicaoTitulo,
  mostrarConfig,
  setMostrarConfig,
  config
}) {
  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          {/* Título com edição */}
          <div className="flex items-center gap-3">
            {editandoTitulo ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={eventoTitulo}
                  onChange={(e) => setEventoTitulo(e.target.value)}
                  className="text-xl font-semibold text-gray-800 bg-transparent border-b-2 border-blue-500 outline-none px-2 py-1"
                  onKeyPress={(e) => e.key === 'Enter' && salvarTitulo()}
                  autoFocus
                />
                <button
                  onClick={salvarTitulo}
                  className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={cancelarEdicaoTitulo}
                  className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-gray-800">{eventoTitulo}</h1>
                <button
                  onClick={() => setEditandoTitulo(true)}
                  className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Intervalo + botão configurações */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
              <span className="font-semibold">Intervalo:</span>&nbsp;
              {config.minimo} - {config.maximo}
            </div>

            <button
              onClick={() => setMostrarConfig(!mostrarConfig)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Settings size={18} />
              <span className="hidden sm:inline">Configurações</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
