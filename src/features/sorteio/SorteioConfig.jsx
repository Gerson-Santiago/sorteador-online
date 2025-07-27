import React, { useState } from 'react';
import { X } from 'lucide-react';
import TituloEditable from './componentes/TituloEditavel';

export default function SorteioConfig({
    config,
    setConfig,
    resetarSorteio,
    onFechar,
    tituloMarquee,
    setTituloMarquee,
    marqueeSpeed,
    setMarqueeSpeed
}) {
    const [editandoTitulo, setEditandoTitulo] = useState(false);
    const [tituloTemp, setTituloTemp] = useState(tituloMarquee);

    const salvarTitulo = () => {
        setTituloMarquee(tituloTemp.trim() || "Seminário de Boas Práticas no uso da tecnologia!");
        setEditandoTitulo(false);
    };

    const cancelarEdicaoTitulo = () => {
        setTituloTemp(tituloMarquee);
        setEditandoTitulo(false);
    };

    return (
        <div className="relative mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            {/* Botão fechar */}
            <button
                onClick={onFechar}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-rose-100 rounded-full hover:bg-rose-200 transition-colors"
                aria-label="Fechar configurações"
            >
                <X size={18} className="text-rose-600" />
            </button>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Configurações do Sorteio</h3>

            {/* Formulário de configurações */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número Mínimo
                    </label>
                    <input
                        type="number"
                        value={config.minimo}
                        onChange={(e) => setConfig(prev => ({ ...prev, minimo: parseInt(e.target.value) || 1 }))}
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
                        onChange={(e) => setConfig(prev => ({ ...prev, maximo: parseInt(e.target.value) || 100 }))}
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
                        onChange={(e) => setConfig(prev => ({ ...prev, quantidade: parseInt(e.target.value) || 1 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.semRepeticao}
                            onChange={(e) => setConfig(prev => ({ ...prev, semRepeticao: e.target.checked }))}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            Sem Repetição
                        </span>
                    </label>
                </div>
            </div>

            {/* Título Editável dentro da Configuração */}
            <div className="col-span-1 sm:col-span-2 mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                    Edite o Título do Evento
                </label>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                    <TituloEditable
                        titulo={tituloTemp}
                        setTitulo={setTituloTemp}
                        editando={editandoTitulo}
                        setEditando={setEditandoTitulo}
                        onSalvar={salvarTitulo}
                        onCancelar={cancelarEdicaoTitulo}
                    />
                </div>
            </div>

            {/* Configurações do Marquee */}
            {/* Campo para editar a velocidade do marquee */}
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Velocidade do Marquee
                </label>
                <input
                    type="number"
                    min="0"
                    value={marqueeSpeed}
                    onChange={(e) => setMarqueeSpeed(Number(e.target.value))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <button
                onClick={resetarSorteio}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
            >
                Resetar Sorteio
            </button>
        </div>
    );
}
