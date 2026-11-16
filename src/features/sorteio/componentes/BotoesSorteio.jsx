// src/features/sorteio/componentes/BotoesSorteio.jsx
import { Shuffle } from 'lucide-react';
import BotaoSortearSemRepetir from './BotaoSortearSemRepetir';

export default function BotoesSorteio({
  onSortear,
  animandoSorteio,
  config,
  numerosDisponiveis,
  mostrarBotaoSemRepetir = true,
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

      {mostrarBotaoSemRepetir && (
        <BotaoSortearSemRepetir
          onSortear={onSortear}
          animandoSorteio={animandoSorteio}
          config={config}
          numerosDisponiveis={numerosDisponiveis}
        />
      )}
    </div>
  );
}
