//sorteador-online/src/features/sorteio/SorteioPage.jsx
import React, { useState, useEffect } from 'react';
import { sortearNumeros } from './sorteioUtils';
import HistoricoSorteios from './HistoricoSorteios';
import SorteioConfig from './SorteioConfig';
import BotoesSorteio from './componentes/BotoesSorteio';
import TituloEditable from './componentes/TituloEditavel';
import DisplayNumeroSorteado from './componentes/DisplayNumeroSorteado';

import { Settings } from 'lucide-react';

export default function SorteadorOnline({ tituloMarquee, setTituloMarquee, marqueeSpeed, setMarqueeSpeed }) {
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

  // Inicializar números disponíveis ao alterar intervalo
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
      try {
        const { sorteados, restantes } = sortearNumeros({
          minimo: config.minimo,
          maximo: config.maximo,
          quantidade: config.quantidade,
          semRepeticao,
          disponiveis: [...numerosDisponiveis]
        });

        if (semRepeticao) {
          setNumerosDisponiveis(restantes);
        }

        const resultado = sorteados.length === 1 ? sorteados[0] : sorteados;
        setNumeroSorteado(resultado);

        const novoItem = {
          id: Date.now(),
          numeros: sorteados,
          timestamp: new Date().toLocaleTimeString('pt-BR'),
          semRepeticao
        };

        setHistorico(prev => [novoItem, ...prev]);
      } catch (error) {
        alert(error instanceof Error ? error.message : String(error));
      } finally {
        setAnimandoSorteio(false);
      }
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">

              {mostrarConfig && (
                <SorteioConfig
                  config={config}
                  setConfig={setConfig}
                  resetarSorteio={resetarSorteio}
                  onFechar={() => setMostrarConfig(false)}
                  tituloMarquee={tituloMarquee}
                  setTituloMarquee={setTituloMarquee}
                  marqueeSpeed={marqueeSpeed}
                  setMarqueeSpeed={setMarqueeSpeed}
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
