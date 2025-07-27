//home/sant/projetos/sorteador-online/src/features/sorteio/SorteioPage.jsx
import React, { useState, useEffect } from 'react';
import { getSecureRandomInt } from './sorteioUtils'; // Importa a função de sorteio seguro
import HistoricoSorteios from './HistoricoSorteios'; // Importa o componente de histórico
import SorteioConfig from './SorteioConfig'; // Importa o componente de configurações
import BotoesSorteio from './componentes/BotoesSorteio'; // Importa os botões de sorteio
import TituloEditable from './componentes/TituloEditavel'; // Importa o componente de título editável
import DisplayNumeroSorteado from './componentes/DisplayNumeroSorteado'; // Importa o componente de exibição do número sorteado


import {
  Settings,
} from 'lucide-react';

export default function SorteadorOnline() {
  // Estados principais
  const [eventoTitulo, setEventoTitulo] = useState('Sorteio de Números');
  const [editandoTitulo, setEditandoTitulo] = useState(false);
  const [numeroSorteado, setNumeroSorteado] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [animandoSorteio, setAnimandoSorteio] = useState(false);
  const [mostrarConfig, setMostrarConfig] = useState(false);

  // Configurações do sorteio
  const [config, setConfig] = useState({
    minimo: 1,
    maximo: 200,
    quantidade: 1,
    semRepeticao: true
  });

  // Números disponíveis para sorteio sem repetição
  const [numerosDisponiveis, setNumerosDisponiveis] = useState([]);

  // Inicializar números disponíveis
  useEffect(() => {
    const nums = [];
    for (let i = config.minimo; i <= config.maximo; i++) {
      nums.push(i);
    }
    setNumerosDisponiveis(nums);
  }, [config.minimo, config.maximo]);

  // Função principal de sorteio
  const sortear = (semRepeticao = false) => {
    if (semRepeticao && numerosDisponiveis.length === 0) {
      alert('Todos os números já foram sorteados!');
      return;
    }

    setAnimandoSorteio(true);
    setNumeroSorteado(null);

    setTimeout(() => {
      const numerosSorteados = [];

      for (let i = 0; i < config.quantidade; i++) {
        let numero;

        if (semRepeticao) {
          if (numerosDisponiveis.length === 0) break;
          const indice = getSecureRandomInt(0, numerosDisponiveis.length - 1);
          numero = numerosDisponiveis[indice];
          setNumerosDisponiveis(prev => prev.filter((_, idx) => idx !== indice));
        } else {
          numero = getSecureRandomInt(config.minimo, config.maximo);
        }

        numerosSorteados.push(numero);
      }

      const resultado = numerosSorteados.length === 1 ? numerosSorteados[0] : numerosSorteados;
      setNumeroSorteado(resultado);

      const novoItem = {
        id: Date.now(),
        numeros: numerosSorteados,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        semRepeticao
      };

      setHistorico(prev => [novoItem, ...prev]);
      setAnimandoSorteio(false);
    }, 2000);
  };

  // Resetar sorteio
  const resetarSorteio = () => {
    setHistorico([]);
    setNumeroSorteado(null);
    const nums = [];
    for (let i = config.minimo; i <= config.maximo; i++) {
      nums.push(i);
    }
    setNumerosDisponiveis(nums);
  };

  // Salvar título editado
  const salvarTitulo = () => {
    setEditandoTitulo(false);
  };

  const cancelarEdicaoTitulo = () => {
    setEditandoTitulo(false);
    setEventoTitulo('Sorteio de Números');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* @- Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">

              {/* @- TituloEditavel  */}
              <TituloEditable
                titulo={eventoTitulo}
                setTitulo={setEventoTitulo}
                editando={editandoTitulo}
                setEditando={setEditandoTitulo}
                onSalvar={salvarTitulo}
                onCancelar={cancelarEdicaoTitulo}
              />




            </div>

            <button
              onClick={() => setMostrarConfig(!mostrarConfig)}
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

          {/* @- Área Principal de Sorteio */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">

              {/* @- Configurações do Sorteio */}
              {mostrarConfig && (
                <SorteioConfig
                  config={config}
                  setConfig={setConfig}
                  resetarSorteio={resetarSorteio}
                  onFechar={() => setMostrarConfig(false)}
                />
              )}


              {/* @- Display do Número Sorteado */}
              <div className="mb-8">
                <DisplayNumeroSorteado
                  numero={numeroSorteado}
                  animando={animandoSorteio}
                />
              </div>

              {/* @- Botões de Sorteio */}
              <BotoesSorteio
                onSortear={sortear}
                animandoSorteio={animandoSorteio}
                config={config}
                numerosDisponiveis={numerosDisponiveis}
              />


              {/* @- Info sobre números disponíveis */}
              {config.semRepeticao && (
                <div className="mt-4 text-sm text-gray-600">
                  Números disponíveis: {numerosDisponiveis.length}
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