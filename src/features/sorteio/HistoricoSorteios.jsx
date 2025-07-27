// HistoricoSorteios.jsx
import React from 'react';
import { History } from 'lucide-react';

export default function HistoricoSorteios({ historico }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <History size={20} className="text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">Histórico</h2>
        <span className="ml-auto text-sm text-gray-500">({historico.length})</span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {historico.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">🎲</div>
            <p>Nenhum sorteio realizado ainda</p>
          </div>
        ) : (
          historico.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-wrap gap-1">
                  {item.numeros.map((num, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-sm font-bold rounded-full"
                    >
                      {num}
                    </span>
                  ))}
                </div>
                {item.semRepeticao && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Sorteado
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">{item.timestamp}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
