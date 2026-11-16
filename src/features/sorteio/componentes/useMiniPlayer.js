import { useCallback, useEffect, useRef, useState } from 'react';
import { semRepeticaoEsgotada } from './sorteioButtonUtils';
import {
  criarUrlMiniPlayer,
  MINI_PLAYER_CHANNEL,
  MINI_PLAYER_MESSAGE,
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
  const [erro, setErro] = useState('');
  const [janelaAberta, setJanelaAberta] = useState(false);

  sortearRef.current = sortear;
  desabilitadoRef.current =
    animandoSorteio || semRepeticaoEsgotada(config, numerosDisponiveis);

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
    });
  }, [ativo, animandoSorteio, config, numerosDisponiveis]);

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
    abrirMiniJanela,
    fecharMiniJanela,
  };
}
