import { useCallback, useEffect, useRef, useState } from 'react';
import { useMiniPlayer } from './componentes/useMiniPlayer';

export function useModoApresentacao({ animandoSorteio, config, numerosDisponiveis, sortear }) {
  const paginaRef = useRef(null);
  const [modoApresentacao, setModoApresentacao] = useState(false);
  const [erro, setErro] = useState('');
  const miniPlayer = useMiniPlayer({
    ativo: modoApresentacao,
    animandoSorteio,
    config,
    numerosDisponiveis,
    sortear,
  });
  const { fecharMiniJanela } = miniPlayer;

  useEffect(() => {
    const sincronizarTelaCheia = () => {
      if (document.fullscreenElement !== paginaRef.current) {
        setModoApresentacao(false);
      }
    };

    document.addEventListener('fullscreenchange', sincronizarTelaCheia);
    return () => document.removeEventListener('fullscreenchange', sincronizarTelaCheia);
  }, []);

  const iniciarApresentacao = useCallback(() => {
    setErro('');
    setModoApresentacao(true);

    const elementoApresentacao = paginaRef.current;
    if (!elementoApresentacao?.requestFullscreen) {
      setErro('Este navegador não oferece suporte ao modo de tela cheia.');
      return;
    }

    elementoApresentacao.requestFullscreen().catch(() => {
      setErro('Não foi possível ativar a tela cheia. Você ainda pode usar o modo apresentação.');
    });
  }, []);

  const sairDaApresentacao = useCallback(async () => {
    fecharMiniJanela();
    if (document.fullscreenElement === paginaRef.current) {
      try {
        await document.exitFullscreen();
      } catch {
        setErro('Não foi possível sair da tela cheia pelo navegador. Pressione Esc para sair.');
      }
    }
    setModoApresentacao(false);
  }, [fecharMiniJanela]);

  return {
    paginaRef,
    modoApresentacao,
    erro: erro || miniPlayer.erro,
    miniJanelaAberta: miniPlayer.janelaAberta,
    iniciarApresentacao,
    sairDaApresentacao,
    abrirMiniJanela: miniPlayer.abrirMiniJanela,
  };
}
