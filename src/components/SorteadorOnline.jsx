import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Shuffle, 
  RotateCcw, 
  History, 
  Edit2,
  Check,
  X
} from 'lucide-react';

// Função de sorteio seguro usando crypto.getRandomValues()
function getSecureRandomInt(min, max) {
  const range = max - min + 1;
  if (range <= 0) throw new Error("Intervalo inválido");

  const maxUint32 = 0xFFFFFFFF;
  const limit = Math.floor(maxUint32 / range) * range;

  const array = new Uint32Array(1);
  let randomNumber;

  do {
    window.crypto.getRandomValues(array);
    randomNumber = array[0];
  } while (randomNumber >= limit);

  return min + (randomNumber % range);
}

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
    maximo: 100,
    quantidade: 1,
    semRepeticao: false
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {editandoTitulo ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={eventoTitulo}
                    onChange={(e) => setEventoTitulo(e.target.value)}
                    className="text-xl font-semibold text-gray-800 bg-transparent border-b-2 border-blue-500 outline-none px-2 py-1"
                    onKeyPress={(e) => e.key === 'Enter' && salvarTitulo()}
                    autoFocus
                  />
                  <button
                    onClick={salvarTitulo}
                    className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={cancelarEdicaoTitulo}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-gray-800">{eventoTitulo}</h1>
                  <button
                    onClick={() => setEditandoTitulo(true)}
                    className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              )}
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
          
          {/* Área Principal de Sorteio */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              
              {/* Configurações (quando visível) */}
              {mostrarConfig && (
                <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Configurações do Sorteio</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número Mínimo
                      </label>
                      <input
                        type="number"
                        value={config.minimo}
                        onChange={(e) => setConfig(prev => ({...prev, minimo: parseInt(e.target.value) || 1}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número Máximo
                      </label>
                      <input
                        type="number"
                        value={config.maximo}
                        onChange={(e) => setConfig(prev => ({...prev, maximo: parseInt(e.target.value) || 100}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantidade de Números
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={config.quantidade}
                        onChange={(e) => setConfig(prev => ({...prev, quantidade: parseInt(e.target.value) || 1}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.semRepeticao}
                          onChange={(e) => setConfig(prev => ({...prev, semRepeticao: e.target.checked}))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Sem Repetição
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  <button
                    onClick={resetarSorteio}
                    className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                  >
                    Resetar Sorteio
                  </button>
                </div>
              )}

              {/* Display do Número Sorteado */}
              <div className="mb-8">
                <div className={`inline-flex items-center justify-center w-48 h-48 mx-auto rounded-full border-4 transition-all duration-500 ${
                  animandoSorteio 
                    ? 'border-blue-400 bg-blue-50 animate-pulse' 
                    : 'border-blue-600 bg-gradient-to-br from-blue-500 to-blue-600'
                }`}>
                  {animandoSorteio ? (
                    <div className="text-2xl font-bold text-blue-600">
                      Sorteando...
                    </div>
                  ) : numeroSorteado !== null ? (
                    <div className="text-center">
                      {Array.isArray(numeroSorteado) ? (
                        <div className="space-y-1">
                          {numeroSorteado.map((num, idx) => (
                            <div key={idx} className="text-3xl font-bold text-white">
                              {num}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-5xl font-bold text-white">
                          {numeroSorteado}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-2xl font-medium text-gray-400">
                      ?
                    </div>
                  )}
                </div>
              </div>

              {/* Botões de Sorteio */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => sortear(false)}
                  disabled={animandoSorteio}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-lg"
                >
                  <Shuffle size={24} />
                  Sortear Agora
                </button>
                
                <button
                  onClick={() => sortear(true)}
                  disabled={animandoSorteio || (config.semRepeticao && numerosDisponiveis.length === 0)}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-lg"
                >
                  <RotateCcw size={24} />
                  Sortear sem Repetir
                </button>
              </div>

              {/* Info sobre números disponíveis */}
              {config.semRepeticao && (
                <div className="mt-4 text-sm text-gray-600">
                  Números disponíveis: {numerosDisponiveis.length}
                </div>
              )}
            </div>
          </div>

          {/* Histórico */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <History size={20} className="text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Histórico</h2>
                <span className="ml-auto text-sm text-gray-500">({historico.length})</span>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {historico.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">🎲</div>
                    <p>Nenhum sorteio realizado ainda</p>
                  </div>
                ) : (
                  historico.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-wrap gap-1">
                          {item.numeros.map((num, idx) => (
                            <span key={idx} className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-sm font-bold rounded-full">
                              {num}
                            </span>
                          ))}
                        </div>
                        {item.semRepeticao && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Sem repetição
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{item.timestamp}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p className="text-sm">
            Sorteio 100% seguro com <code className="bg-gray-100 px-2 py-1 rounded text-xs">crypto.getRandomValues()</code>
          </p>
          <p className="text-xs mt-1 opacity-75">
            Algoritmo criptograficamente seguro - Sem viés estatístico
          </p>
        </div>
      </footer>
    </div>
  );
}