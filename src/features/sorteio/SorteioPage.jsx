// src/features/sorteio/SorteioPage.jsx
import { useState } from 'react';
import { useSorteio } from './useSorteio';
import { useModoJanela } from './useModoJanela';
import { useEvento } from './EventoContext';
import HistoricoSorteios from './HistoricoSorteios';
import SorteioConfig from './SorteioConfig';
import BotoesSorteio from './componentes/BotoesSorteio';
import MarqueeHeader from './componentes/MarqueeHeader';
import TituloEditavel from './componentes/TituloEditavel';
import DisplayNumeroSorteado from './componentes/DisplayNumeroSorteado';
import { AppWindow, Settings } from 'lucide-react';

/**
 * Página principal do sorteador.
 * Toda a lógica de negócio vive em useSorteio().
 * Configurações de evento (título, marquee) vêm do EventoContext.
 * Sem prop drilling.
 */
export default function SorteadorOnline() {
  const { titulo, setTitulo, marqueeTexto, marqueeSpeed } = useEvento();

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

  const { erro, janelaAberta, alternarModoJanela } = useModoJanela({
    animandoSorteio,
    config,
    numerosDisponiveis,
    sortear,
  });

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
      <MarqueeHeader titulo={marqueeTexto} speed={marqueeSpeed} />
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

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMostrarConfig((v) => !v)}
                aria-label="Configurações"
                title="Configurações"
                className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={() => {
                  if (!janelaAberta) setMostrarConfig(false);
                  alternarModoJanela();
                }}
                aria-label={janelaAberta ? 'Fechar janela do sorteio' : 'Abrir janela do sorteio'}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors font-semibold ${
                  janelaAberta
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                <AppWindow size={18} />
                {janelaAberta ? 'JANELA ABERTA' : 'MODO JANELA'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {erro && (
          <p role="status" className="mb-4 text-center text-sm text-amber-700">
            {erro}
          </p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
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
