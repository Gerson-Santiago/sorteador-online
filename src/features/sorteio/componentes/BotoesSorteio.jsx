// src/features/sorteio/componentes/BotoesSorteio.jsx
import React from 'react';
import { Shuffle, RotateCcw } from 'lucide-react';

export default function BotoesSorteio({
  onSortear,
  animandoSorteio,
  config,
  numerosDisponiveis
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={() => onSortear(false)}
        disabled={animandoSorteio}
        className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-lg"
      >
        <Shuffle size={24} />
        Sortear Agora
      </button>

      <button
        onClick={() => onSortear(true)}
        disabled={
          animandoSorteio || (config.semRepeticao && numerosDisponiveis.length === 0)
        }
        className="flex items-center justify-center gap-3 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-lg"
      >
        <RotateCcw size={24} />
        Sortear sem Repetir
      </button>
    </div>
  );
}
