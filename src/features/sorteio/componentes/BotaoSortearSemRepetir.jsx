import { RotateCcw } from 'lucide-react';
import { semRepeticaoEsgotada } from './sorteioButtonUtils';

export default function BotaoSortearSemRepetir({
  onSortear,
  animandoSorteio,
  config,
  numerosDisponiveis,
  compacto = false,
}) {
  const desabilitado =
    animandoSorteio || semRepeticaoEsgotada(config, numerosDisponiveis);

  return (
    <button
      onClick={() => onSortear(true)}
      disabled={desabilitado}
      className={`flex items-center justify-center gap-3 ${
        compacto ? 'w-full px-4 py-3 text-base' : 'px-8 py-4 text-lg'
      } bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold shadow-lg`}
    >
      <RotateCcw size={compacto ? 20 : 24} />
      Sortear sem Repetir
    </button>
  );
}
