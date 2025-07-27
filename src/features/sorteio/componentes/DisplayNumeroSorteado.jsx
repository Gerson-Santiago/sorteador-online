import React from 'react';

export default function DisplayNumeroSorteado({ numero, animando }) {
  return (
    <div
      className={`inline-flex items-center justify-center w-48 h-48 mx-auto rounded-full border-8 transition-all duration-500 ${animando
          ? 'border-blue-300 bg-blue-50 animate-pulse'
          : 'border-blue-600 bg-gradient-to-br from-blue-500 to-blue-700'
        }`}
    >
      {animando ? (
        <div className="text-3xl font-semibold text-blue-600">Sorteando...</div>
      ) : numero !== null ? (
        <div className="text-center">
          {Array.isArray(numero) ? (
            <div className="space-y-2">
              {numero.map((num, idx) => (
                <div key={idx} className="text-4xl font-bold text-white">{num}</div>
              ))}
            </div>
          ) : (
            <div className="text-7xl font-extrabold text-white">{numero}</div>
          )}
        </div>
      ) : (
        <div className="text-3xl font-medium text-gray-400">?</div>
      )}
    </div>
  );
}
