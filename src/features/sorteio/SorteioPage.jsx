// src/features/sorteio/SorteioPage.jsx
import { useEffect, useRef, useState } from 'react';
import { useSorteio } from './useSorteio';
import { semRepeticaoEsgotada } from './componentes/sorteioButtonUtils';
import { MINI_PLAYER_CHANNEL, MINI_PLAYER_MESSAGE } from './componentes/miniPlayerProtocol';
import { useEvento } from './EventoContext';
import HistoricoSorteios from './HistoricoSorteios';
import SorteioConfig from './SorteioConfig';
import BotoesSorteio from './componentes/BotoesSorteio';
import MarqueeHeader from './componentes/MarqueeHeader';
import TituloEditavel from './componentes/TituloEditavel';
import DisplayNumeroSorteado from './componentes/DisplayNumeroSorteado';
import { Maximize, Minimize, Settings } from 'lucide-react';

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
  const [modoApresentacao, setModoApresentacao] = useState(false);
  const [erroTelaCheia, setErroTelaCheia] = useState('');
  const paginaRef = useRef(null);
  const miniJanelaRef = useRef(null);
  const canalMiniPlayerRef = useRef(null);
  const sortearSemRepetirRef = useRef(null);
  const miniPlayerDesabilitadoRef = useRef(true);
  const [miniJanelaAberta, setMiniJanelaAberta] = useState(false);

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

  sortearSemRepetirRef.current = () => sortear(true);
  miniPlayerDesabilitadoRef.current =
    animandoSorteio || semRepeticaoEsgotada(config, numerosDisponiveis);

  const iniciarEdicaoTitulo = () => {
    setTituloAnterior(titulo); // salva o valor real antes de editar
  };

  const salvarTitulo = () => setEditandoTitulo(false);

  const cancelarEdicaoTitulo = () => {
    setTitulo(tituloAnterior); // restaura o valor anterior — sem hardcode
    setEditandoTitulo(false);
  };

  useEffect(() => {
    const sincronizarTelaCheia = () => {
      if (document.fullscreenElement !== paginaRef.current) {
        setModoApresentacao(false);
      }
    };

    document.addEventListener('fullscreenchange', sincronizarTelaCheia);
    return () => document.removeEventListener('fullscreenchange', sincronizarTelaCheia);
  }, []);

  useEffect(() => {
    if (!modoApresentacao || !('BroadcastChannel' in window)) return undefined;

    const canal = new BroadcastChannel(MINI_PLAYER_CHANNEL);
    canalMiniPlayerRef.current = canal;
    canal.onmessage = ({ data }) => {
      if (data.type === MINI_PLAYER_MESSAGE.READY) {
        canal.postMessage({
          type: MINI_PLAYER_MESSAGE.STATE,
          disabled: miniPlayerDesabilitadoRef.current,
        });
      }

      if (data.type === MINI_PLAYER_MESSAGE.DRAW && !miniPlayerDesabilitadoRef.current) {
        sortearSemRepetirRef.current();
      }
    };

    return () => {
      canal.close();
      canalMiniPlayerRef.current = null;
    };
  }, [modoApresentacao]);

  useEffect(() => {
    canalMiniPlayerRef.current?.postMessage({
      type: MINI_PLAYER_MESSAGE.STATE,
      disabled: miniPlayerDesabilitadoRef.current,
    });
  }, [modoApresentacao, animandoSorteio, config, numerosDisponiveis]);

  useEffect(() => {
    if (!modoApresentacao) {
      if (miniJanelaRef.current && !miniJanelaRef.current.closed) {
        miniJanelaRef.current.close();
      }
      miniJanelaRef.current = null;
      setMiniJanelaAberta(false);
      return undefined;
    }

    const verificarJanela = window.setInterval(() => {
      const aberta = Boolean(miniJanelaRef.current && !miniJanelaRef.current.closed);
      setMiniJanelaAberta(aberta);
    }, 500);

    return () => window.clearInterval(verificarJanela);
  }, [modoApresentacao]);

  const abrirMiniJanela = () => {
    if (miniJanelaRef.current && !miniJanelaRef.current.closed) {
      miniJanelaRef.current.focus();
      return;
    }

    if (!('BroadcastChannel' in window)) {
      setErroTelaCheia('Este navegador não oferece suporte à comunicação com a mini janela.');
      return;
    }

    const urlMiniPlayer = new URL(window.location.href);
    urlMiniPlayer.searchParams.set('mini-player', '1');
    const miniJanela = window.open(
      urlMiniPlayer.href,
      'sorteador-mini-player',
      'popup=yes,width=360,height=230,resizable=yes'
    );

    if (!miniJanela) {
      setMiniJanelaAberta(false);
      setErroTelaCheia('O navegador bloqueou a mini janela. Permita pop-ups para abrir o mini sorteador.');
      return;
    }

    miniJanelaRef.current = miniJanela;
    setMiniJanelaAberta(true);
    setErroTelaCheia('');
  };

  const apresentar = () => {
    setMostrarConfig(false);
    setErroTelaCheia('');
    setModoApresentacao(true);

    const elementoApresentacao = paginaRef.current;
    if (!elementoApresentacao?.requestFullscreen) {
      setErroTelaCheia('Este navegador não oferece suporte ao modo de tela cheia.');
      return;
    }

    elementoApresentacao.requestFullscreen().catch(() => {
      setErroTelaCheia('Não foi possível ativar a tela cheia. Você ainda pode usar o modo apresentação.');
    });
  };

  const sairDaApresentacao = async () => {
    if (miniJanelaRef.current && !miniJanelaRef.current.closed) {
      miniJanelaRef.current.close();
    }
    miniJanelaRef.current = null;
    setMiniJanelaAberta(false);

    if (document.fullscreenElement === paginaRef.current) {
      try {
        await document.exitFullscreen();
      } catch {
        setErroTelaCheia('Não foi possível sair da tela cheia pelo navegador. Pressione Esc para sair.');
      }
    }
    setModoApresentacao(false);
  };

  return (
    <div
      ref={paginaRef}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <MarqueeHeader titulo={marqueeTexto} speed={marqueeSpeed} />
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {modoApresentacao ? (
              <h1 className="text-xl font-semibold text-gray-800">{titulo}</h1>
            ) : (
              <TituloEditavel
                titulo={titulo}
                setTitulo={setTitulo}
                editando={editandoTitulo}
                setEditando={setEditandoTitulo}
                onIniciarEdicao={iniciarEdicaoTitulo}
                onSalvar={salvarTitulo}
                onCancelar={cancelarEdicaoTitulo}
              />
            )}

            <div className="flex items-center gap-2">
              {!modoApresentacao && (
                <>
                  <button
                    onClick={() => setMostrarConfig((v) => !v)}
                    aria-label="Configurações"
                    title="Configurações"
                    className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Settings size={18} />
                  </button>
                  <button
                    onClick={apresentar}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                  >
                    <Maximize size={18} />
                    APRESENTAR
                  </button>
                </>
              )}
              {modoApresentacao && (
                <>
                  {!miniJanelaAberta && (
                    <button
                      onClick={abrirMiniJanela}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      <Maximize size={18} />
                      Abrir mini janela
                    </button>
                  )}
                  <button
                    onClick={sairDaApresentacao}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    <Minimize size={18} />
                    <span className="hidden sm:inline">Sair da apresentação</span>
                    <span className="sm:hidden">Sair</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div
        className={`mx-auto px-4 py-8 ${
          modoApresentacao ? 'max-w-[1600px] lg:py-10' : 'max-w-6xl'
        }`}
      >
        {erroTelaCheia && (
          <p role="status" className="mb-4 text-center text-sm text-amber-700">
            {erroTelaCheia}
          </p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div
              className={`rounded-2xl shadow-lg p-8 text-center ${
                modoApresentacao ? 'lg:p-12' : ''
              } bg-white`}
            >
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
                  apresentacao={modoApresentacao}
                />
              </div>

              <BotoesSorteio
                onSortear={sortear}
                animandoSorteio={animandoSorteio}
                config={config}
                numerosDisponiveis={numerosDisponiveis}
                mostrarBotaoSemRepetir={!modoApresentacao}
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
