import { useCallback, useEffect, useRef, useState } from 'react';
import { semRepeticaoEsgotada } from '../componentes/sorteioButtonUtils';
import {
  criarUrlMiniPlayer,
  MINI_PLAYER_CHANNEL,
  MINI_PLAYER_MESSAGE,
  MINI_PLAYER_ZOOM,
  calcularZoomMiniPlayer,
  processarMensagemMiniPlayer,
} from './miniPlayerProtocol';

export function useMiniPlayer({
  ativo,
  animandoSorteio,
  config,
  numerosDisponiveis,
  sortear,
}) {
  const janelaRef = useRef(null);
  const canalRef = useRef(null);
  const sortearRef = useRef(sortear);
  const desabilitadoRef = useRef(true);
  const [zoom, setZoom] = useState(MINI_PLAYER_ZOOM.DEFAULT);
  const [erro, setErro] = useState('');
  const [janelaAberta, setJanelaAberta] = useState(false);

  sortearRef.current = sortear;
  desabilitadoRef.current =
    animandoSorteio || semRepeticaoEsgotada(config, numerosDisponiveis);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  useEffect(() => {
    document.documentElement.style.zoom = String(zoom);
  }, [zoom]);

  useEffect(() => {
    const zoomOriginal = document.documentElement.style.zoom;
    return () => {
      document.documentElement.style.zoom = zoomOriginal;
    };
  }, []);

  const fecharMiniJanela = useCallback(() => {
    if (janelaRef.current && !janelaRef.current.closed) {
      janelaRef.current.close();
    }
    janelaRef.current = null;
    setJanelaAberta(false);
  }, []);

  useEffect(() => {
    if (!ativo || !('BroadcastChannel' in window)) return undefined;

    const canal = new BroadcastChannel(MINI_PLAYER_CHANNEL);
    canalRef.current = canal;
    canal.onmessage = ({ data }) => {
      processarMensagemMiniPlayer({
        data,
        desabilitado: desabilitadoRef.current,
        zoom: zoomRef.current,
        ajustarZoom: (delta) => {
          if (Number.isFinite(delta)) {
            setZoom((atual) => calcularZoomMiniPlayer(atual, delta));
          }
        },
        sortear: (semRepeticao) => sortearRef.current(semRepeticao),
        publicarEstado: (estado) => canal.postMessage(estado),
      });
    };

    return () => {
      canal.close();
      canalRef.current = null;
    };
  }, [ativo]);

  useEffect(() => {
    canalRef.current?.postMessage({
      type: MINI_PLAYER_MESSAGE.STATE,
      disabled: desabilitadoRef.current,
      zoom,
    });
  }, [ativo, animandoSorteio, config, numerosDisponiveis, zoom]);

  useEffect(() => {
    if (!ativo) {
      fecharMiniJanela();
      return undefined;
    }

    const verificarJanela = window.setInterval(() => {
      setJanelaAberta(Boolean(janelaRef.current && !janelaRef.current.closed));
    }, 500);

    return () => window.clearInterval(verificarJanela);
  }, [ativo, fecharMiniJanela]);

  const abrirMiniJanela = useCallback(() => {
    if (janelaRef.current && !janelaRef.current.closed) {
      janelaRef.current.focus();
      return;
    }

    if (!('BroadcastChannel' in window)) {
      setErro('Este navegador não oferece suporte à comunicação com a mini janela.');
      return;
    }

    const janela = window.open(
      criarUrlMiniPlayer(window.location.href),
      'sorteador-mini-player',
      'popup=yes,width=360,height=230,resizable=yes'
    );

    if (!janela) {
      setJanelaAberta(false);
      setErro('O navegador bloqueou a mini janela. Permita pop-ups para abrir o mini sorteador.');
      return;
    }

    janelaRef.current = janela;
    setJanelaAberta(true);
    setErro('');
  }, []);

  return {
    janelaAberta,
    erro,
    zoom,
    abrirMiniJanela,
    fecharMiniJanela,
  };
}
