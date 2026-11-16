import { useEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import BotaoSortearSemRepetir from './BotaoSortearSemRepetir';
import {
  MINI_PLAYER_CHANNEL,
  MINI_PLAYER_MESSAGE,
  MINI_PLAYER_ZOOM,
  limitarZoomMiniPlayer,
} from './miniPlayerProtocol';

export default function MiniPlayer() {
  const canalRef = useRef(null);
  const [conectado, setConectado] = useState(false);
  const [desabilitado, setDesabilitado] = useState(true);
  const [zoom, setZoom] = useState(MINI_PLAYER_ZOOM.DEFAULT);

  useEffect(() => {
    if (!('BroadcastChannel' in window)) return undefined;

    const canal = new BroadcastChannel(MINI_PLAYER_CHANNEL);
    canalRef.current = canal;
    let tentativas = 0;
    const anunciarPronto = () => {
      canal.postMessage({ type: MINI_PLAYER_MESSAGE.READY });
      tentativas += 1;
      if (tentativas >= 20) window.clearInterval(intervalo);
    };

    const intervalo = window.setInterval(anunciarPronto, 250);
    canal.onmessage = ({ data }) => {
      if (data.type !== MINI_PLAYER_MESSAGE.STATE) return;

      setDesabilitado(data.disabled);
      setConectado(true);
      window.clearInterval(intervalo);
    };
    anunciarPronto();

    return () => {
      window.clearInterval(intervalo);
      canal.close();
      canalRef.current = null;
    };
  }, []);

  const sortear = () => {
    canalRef.current?.postMessage({ type: MINI_PLAYER_MESSAGE.DRAW });
  };

  const ajustarZoom = (delta) => {
    setZoom((atual) => limitarZoomMiniPlayer(atual + delta));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3">
      <section className="mx-auto max-w-sm overflow-hidden rounded-xl bg-white shadow-lg">
        <header className="flex items-center justify-between gap-2 bg-blue-600 px-3 py-3 text-white">
          <h1 className="font-semibold">Mini sorteador</h1>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => ajustarZoom(-MINI_PLAYER_ZOOM.STEP)}
              disabled={zoom <= MINI_PLAYER_ZOOM.MIN}
              aria-label="Diminuir zoom da mini janela"
              title="Diminuir zoom"
              className="rounded p-1 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ZoomOut size={18} />
            </button>
            <span className="min-w-10 text-center text-xs font-medium">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => ajustarZoom(MINI_PLAYER_ZOOM.STEP)}
              disabled={zoom >= MINI_PLAYER_ZOOM.MAX}
              aria-label="Aumentar zoom da mini janela"
              title="Aumentar zoom"
              className="rounded p-1 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ZoomIn size={18} />
            </button>
            <button
              type="button"
              onClick={() => window.close()}
              aria-label="Fechar mini sorteador"
              title="Fechar mini sorteador"
              className="rounded p-1 hover:bg-blue-700"
            >
              <X size={20} />
            </button>
          </div>
        </header>
        <div className="space-y-3 p-4" style={{ zoom }}>
          <BotaoSortearSemRepetir
            onSortear={sortear}
            animandoSorteio={!conectado}
            config={{ semRepeticao: true }}
            numerosDisponiveis={desabilitado ? [] : [1]}
            compacto
          />
          <p className="text-center text-xs text-gray-600">
            Arraste esta janela pelo título do navegador para outro monitor.
          </p>
          {!conectado && (
            <p role="status" className="text-center text-xs text-amber-700">
              Aguardando conexão com o sorteio principal…
            </p>
          )}
          {conectado && desabilitado && (
            <p role="status" className="text-center text-xs text-gray-600">
              Aguarde o sorteio terminar ou verifique se ainda há números disponíveis.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
