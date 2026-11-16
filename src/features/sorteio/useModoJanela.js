import { useState } from 'react';
import { useMiniPlayer } from './componentes/useMiniPlayer';

export function useModoJanela({ animandoSorteio, config, numerosDisponiveis, sortear }) {
  const [ativo, setAtivo] = useState(false);
  const miniPlayer = useMiniPlayer({
    ativo,
    animandoSorteio,
    config,
    numerosDisponiveis,
    sortear,
  });

  const alternarModoJanela = () => {
    if (miniPlayer.janelaAberta) {
      miniPlayer.fecharMiniJanela();
      setAtivo(false);
      return;
    }

    setAtivo(true);
    miniPlayer.abrirMiniJanela();
  };

  return {
    erro: miniPlayer.erro,
    janelaAberta: miniPlayer.janelaAberta,
    alternarModoJanela,
  };
}
