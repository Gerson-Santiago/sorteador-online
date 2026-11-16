// src/features/sorteio/SorteioPage.jsx
import { useState } from 'react';
import { useSorteio } from './useSorteio';
import { useEvento } from './EventoContext';
import HistoricoSorteios from './HistoricoSorteios';
import SorteioConfig from './SorteioConfig';
import BotoesSorteio from './componentes/BotoesSorteio';
import TituloEditavel from './componentes/TituloEditavel';
import DisplayNumeroSorteado from './componentes/DisplayNumeroSorteado';
import { Settings } from 'lucide-react';

/**
 * Página principal do sorteador.
 * Toda a lógica de negócio vive em useSorteio().
 * Configurações de evento (título, marquee) vêm do EventoContext.
 * Sem prop drilling.
 */
export default function SorteadorOnline() {
  const { titulo, setTitulo } = useEvento();

  const [editandoTitulo, setEditandoTitulo] = useState(false);
  const [tituloAnterior, setTituloAnterior] = useState('');
  const [mostrarConfig, setMostrarConfig] = useState(false);

  const {
    config,
    setConfig,
    numerosDisponiveis,
    numeroSorteado,
    historico,
    animandoSorteio,
    sortear,
    resetarSorteio,
  } = useSorteio();

  const iniciarEdicaoTitulo = () => {
    setTituloAnterior(titulo); // salva o valor real antes de editar
  };

  const salvarTitulo = () => setEditandoTitulo(false);

  const cancelarEdicaoTitulo = () => {
    setTitulo(tituloAnterior); // restaura o valor anterior — sem hardcode
    setEditandoTitulo(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <TituloEditavel
              titulo={titulo}
              setTitulo={setTitulo}
              editando={editandoTitulo}
              setEditando={setEditandoTitulo}
              onIniciarEdicao={iniciarEdicaoTitulo}
              onSalvar={salvarTitulo}
              onCancelar={cancelarEdicaoTitulo}
            />

            <button
              onClick={() => setMostrarConfig((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Settings size={18} />
              <span className="hidden sm:inline">Configurações</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              {mostrarConfig && (
                <SorteioConfig
                  config={config}
                  setConfig={setConfig}
                  resetarSorteio={resetarSorteio}
                  onFechar={() => setMostrarConfig(false)}
                />
              )}

              <div className="mb-8">
                <DisplayNumeroSorteado
                  numero={numeroSorteado}
                  animando={animandoSorteio}
                />
              </div>

              <BotoesSorteio
                onSortear={sortear}
                animandoSorteio={animandoSorteio}
                config={config}
                numerosDisponiveis={numerosDisponiveis}
              />

              {config.semRepeticao && (
                <div className="mt-4 text-sm text-gray-600">
                  Números disponíveis:{' '}
                  <span className="font-semibold text-blue-600">
                    {numerosDisponiveis.length}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <HistoricoSorteios historico={historico} />
          </div>
        </div>
      </div>
    </div>
  );
}
