// src/features/sorteio/SorteioConfig.jsx
import { useState } from 'react';
import { X } from 'lucide-react';
import { useEvento } from './EventoContext';
import TituloEditavel from './componentes/TituloEditavel';

/**
 * Painel de configurações do sorteio.
 * Lê marqueeTexto e marqueeSpeed diretamente do EventoContext —
 * sem receber essas props via prop drilling.
 */
export default function SorteioConfig({ config, setConfig, resetarSorteio, onFechar }) {
  const { marqueeTexto, setMarqueeTexto, marqueeSpeed, setMarqueeSpeed } = useEvento();

  const [editandoMarquee, setEditandoMarquee] = useState(false);
  const [textoTemp, setTextoTemp] = useState(marqueeTexto);
  const [textoAnterior, setTextoAnterior] = useState('');

  const iniciarEdicaoMarquee = () => {
    setTextoAnterior(textoTemp);
  };

  const salvarMarquee = () => {
    setMarqueeTexto(textoTemp.trim() || 'Seminário de Boas Práticas');
    setEditandoMarquee(false);
  };

  const cancelarEdicaoMarquee = () => {
    setTextoTemp(textoAnterior); // restaura o valor anterior real
    setEditandoMarquee(false);
  };

  return (
    <div className="relative mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 text-left">
      <button
        onClick={onFechar}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-rose-100 rounded-full hover:bg-rose-200 transition-colors"
        aria-label="Fechar configurações"
      >
        <X size={18} className="text-rose-600" />
      </button>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">Configurações do Sorteio</h3>

      {/* Intervalo e quantidade */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número Mínimo</label>
          <input
            type="number"
            value={config.minimo}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, minimo: parseInt(e.target.value) || 1 }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número Máximo</label>
          <input
            type="number"
            value={config.maximo}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, maximo: parseInt(e.target.value) || 100 }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantidade de Números
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={config.quantidade}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, quantidade: parseInt(e.target.value) || 1 }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.semRepeticao}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, semRepeticao: e.target.checked }))
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Sem Repetição</span>
          </label>
        </div>
      </div>

      {/* Texto do Banner */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
          Texto do Banner (Marquee)
        </label>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <TituloEditavel
            titulo={textoTemp}
            setTitulo={setTextoTemp}
            editando={editandoMarquee}
            setEditando={setEditandoMarquee}
            onIniciarEdicao={iniciarEdicaoMarquee}
            onSalvar={salvarMarquee}
            onCancelar={cancelarEdicaoMarquee}
          />
        </div>
      </div>

      {/* Velocidade do Marquee */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Velocidade do Marquee{' '}
          <span className="text-gray-400 font-normal">(segundos por ciclo — 0 = parado)</span>
        </label>
        <input
          type="number"
          min="0"
          value={marqueeSpeed}
          onChange={(e) => setMarqueeSpeed(Number(e.target.value))}
          className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Resetar */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={resetarSorteio}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
        >
          Resetar Sorteio
        </button>
      </div>
    </div>
  );
}
