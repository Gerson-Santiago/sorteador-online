// src/features/sorteio/useSorteio.js
import { useState, useEffect } from 'react';
import { sortearNumeros, criarFaixa } from './sorteioUtils';

/** Duração da animação de sorteio em ms */
const DURACAO_ANIMACAO_MS = 2000;

/**
 * Hook que encapsula toda a lógica de estado do sorteio,
 * delegando as regras puras de sorteio para sorteioUtils (SSoT).
 */
export function useSorteio() {
  const [config, setConfig] = useState({
    minimo: 1,
    maximo: 200,
    quantidade: 1,
    semRepeticao: true,
  });

  const [numerosDisponiveis, setNumerosDisponiveis] = useState(() =>
    criarFaixa(1, 200)
  );
  const [numeroSorteado, setNumeroSorteado] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [animandoSorteio, setAnimandoSorteio] = useState(false);

  // Reinicia o pool quando o intervalo muda
  useEffect(() => {
    setNumerosDisponiveis(criarFaixa(config.minimo, config.maximo));
  }, [config.minimo, config.maximo]);

  const sortear = (semRepeticao = false) => {
    if (semRepeticao && numerosDisponiveis.length === 0) {
      alert('Todos os números já foram sorteados!');
      return;
    }

    if (semRepeticao && config.quantidade > numerosDisponiveis.length) {
      alert(`Quantidade solicitada (${config.quantidade}) é maior que os números disponíveis (${numerosDisponiveis.length}).`);
      return;
    }

    setAnimandoSorteio(true);
    setNumeroSorteado(null);

    // Snapshot imutável da lista de disponíveis
    const pool = [...numerosDisponiveis];

    setTimeout(() => {
      try {
        // SSoT: Toda regra de sorteio é delegada para sortearNumeros
        const { sorteados, restantes } = sortearNumeros({
          minimo: config.minimo,
          maximo: config.maximo,
          quantidade: config.quantidade,
          semRepeticao,
          disponiveis: pool,
        });

        if (semRepeticao) {
          setNumerosDisponiveis(restantes);
        }

        setNumeroSorteado(sorteados.length === 1 ? sorteados[0] : sorteados);
        setHistorico((prev) => [
          {
            id: Date.now(),
            numeros: sorteados,
            timestamp: new Date().toLocaleTimeString('pt-BR'),
            semRepeticao,
          },
          ...prev,
        ]);
      } catch (error) {
        alert(error instanceof Error ? error.message : String(error));
      } finally {
        setAnimandoSorteio(false);
      }
    }, DURACAO_ANIMACAO_MS);
  };

  const resetarSorteio = () => {
    setHistorico([]);
    setNumeroSorteado(null);
    setNumerosDisponiveis(criarFaixa(config.minimo, config.maximo));
  };

  return {
    config,
    setConfig,
    numerosDisponiveis,
    numeroSorteado,
    historico,
    animandoSorteio,
    sortear,
    resetarSorteio,
  };
}
